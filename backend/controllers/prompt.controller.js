import { db } from '../config/firebase.js';
import { 
  doc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { USERS_COLLECTION } from '../model/authentication.model.js';
import { PROMPTS_COLLECTION, promptLimits } from '../model/prompt.model.js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { sanitizeInput, isValidDocumentId } from '../utils/validation.js';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

// Safety settings to prevent harmful content generation
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Default generation config
const defaultGenerationConfig = {
  temperature: promptLimits.defaultTemperature,
  topP: promptLimits.defaultTopP,
  topK: promptLimits.defaultTopK,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

/**
 * Check and update user's prompt usage limits
 * @param {string} userId - User ID
 * @returns {Object} - Status of the limit check
 */
const checkAndUpdatePromptLimits = async (userId) => {
  if (!isValidDocumentId(userId)) {
    return { allowed: false, error: 'Invalid user ID format' };
  }

  const userDocRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    return { allowed: false, error: 'User not found' };
  }
  
  const userData = userDoc.data();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  // Initialize prompt usage if not exists
  let promptUsage = userData.promptUsage || {
    count: 0,
    dailyCount: 0,
    lastUsed: null,
    dailyReset: null
  };
  
  // Check if we need to reset daily count
  const dailyReset = promptUsage.dailyReset ? promptUsage.dailyReset.toDate().getTime() : 0;
  if (!dailyReset || dailyReset < today) {
    promptUsage.dailyCount = 0;
    promptUsage.dailyReset = Timestamp.fromDate(new Date(today));
  }
  
  // Check if user has exceeded daily limit
  if (promptUsage.dailyCount >= promptLimits.dailyLimit) {
    return { 
      allowed: false, 
      error: `Daily limit of ${promptLimits.dailyLimit} prompts exceeded. Please try again tomorrow.`,
      dailyCount: promptUsage.dailyCount,
      dailyLimit: promptLimits.dailyLimit
    };
  }
  
  // Update usage count
  promptUsage.count += 1;
  promptUsage.dailyCount += 1;
  promptUsage.lastUsed = serverTimestamp();
  
  // Update user document
  await updateDoc(userDocRef, { promptUsage });
  
  return { 
    allowed: true, 
    dailyCount: promptUsage.dailyCount,
    dailyLimit: promptLimits.dailyLimit
  };
};

/**
 * Generate image from prompt
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const generateImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Already validated by Joi schema
    const { prompt, model: modelName, options } = req.body;
    
    // Additional sanitization
    const sanitizedPrompt = sanitizeInput(prompt);
    
    // Validate prompt length
    if (sanitizedPrompt.length > promptLimits.maxLength) {
      return res.status(400).json({ 
        message: `Prompt exceeds maximum length of ${promptLimits.maxLength} characters` 
      });
    }

    // Validate model type
    if (modelName && !['gemini-2.0-flash-exp-image-generation'].includes(modelName)) {
      return res.status(400).json({ message: 'Invalid model specified' });
    }
    
    // Check user limits
    const limitCheck = await checkAndUpdatePromptLimits(req.user.uid);
    if (!limitCheck.allowed) {
      return res.status(429).json({ 
        message: limitCheck.error,
        dailyCount: limitCheck.dailyCount,
        dailyLimit: limitCheck.dailyLimit
      });
    }
    
    // Create generation config merging defaults with user preferences
    // But limit options to prevent abuse
    const generationConfig = { ...defaultGenerationConfig };
    
    if (options) {
      // Only allow specific config options with bounds checking
      if (options.temperature !== undefined) {
        generationConfig.temperature = Math.min(Math.max(options.temperature, 0), 1);
      }
      if (options.topP !== undefined) {
        generationConfig.topP = Math.min(Math.max(options.topP, 0), 1);
      }
      if (options.topK !== undefined) {
        generationConfig.topK = Math.min(Math.max(options.topK, 1), 40);
      }
    }
    
    // Store prompt request in Firestore
    const promptRef = await addDoc(collection(db, PROMPTS_COLLECTION), {
      userId: req.user.uid,
      text: sanitizedPrompt,
      status: 'pending',
      createdAt: serverTimestamp(),
      generationConfig,
      metadata: {
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.clientIp || req.ip || 'unknown'
      }
    });
    
    // Start async generation - we'll update the document when complete
    generateImageAsync(promptRef.id, sanitizedPrompt, generationConfig)
      .catch(error => console.error(`Error generating image for prompt ${promptRef.id}:`, error));
    
    // Return success with the prompt ID
    res.status(202).json({ 
      message: 'Image generation started',
      promptId: promptRef.id,
      dailyCount: limitCheck.dailyCount,
      dailyLimit: limitCheck.dailyLimit
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Failed to generate image' });
  }
};

/**
 * Asynchronous image generation function
 * @param {string} promptId - Prompt document ID
 * @param {string} promptText - The prompt text
 * @param {Object} generationConfig - Generation configuration
 */
const generateImageAsync = async (promptId, promptText, generationConfig) => {
  try {
    // Get prompt document reference
    const promptDocRef = doc(db, PROMPTS_COLLECTION, promptId);
    
    try {
      // Create chat session and send message with safety settings
      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });
      
      const result = await chatSession.sendMessage(promptText);
      const responseText = result.response.text();
      
      // Extract image URL from response if text contains a URL
      // Note: This is a simplified approach - actual implementation will depend on Gemini's response format
      const imageUrl = extractImageUrl(responseText);
      
      // Update prompt document with success
      await updateDoc(promptDocRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        imageUrl: imageUrl || null,
        response: responseText
      });
    } catch (genError) {
      console.error(`Generation error for prompt ${promptId}:`, genError);
      
      // Update prompt document with error
      await updateDoc(promptDocRef, {
        status: 'failed',
        completedAt: serverTimestamp(),
        error: genError.message || 'Unknown error occurred'
      });
    }
  } catch (error) {
    console.error(`Error in generateImageAsync for prompt ${promptId}:`, error);
  }
};

/**
 * Extract image URL from Gemini response
 * Note: This function is placeholder and should be adapted to the actual Gemini response format
 * @param {string} text - Response text
 * @returns {string|null} - Extracted image URL or null
 */
const extractImageUrl = (text) => {
  // This is a placeholder - you would need to implement based on actual Gemini response format
  try {
    if (text.includes('http')) {
      // Use a safer URL extraction method
      const urlRegex = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/;
      const match = text.match(urlRegex);
      return match ? match[0] : null;
    }
    return null;
  } catch (error) {
    console.error('Error extracting image URL:', error);
    return null;
  }
};

/**
 * Get a specific prompt by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getPrompt = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { promptId } = req.params;
    
    // Validate prompt ID
    if (!promptId || !isValidDocumentId(promptId)) {
      return res.status(400).json({ message: 'Invalid prompt ID format' });
    }
    
    // Get prompt document
    const promptDocRef = doc(db, PROMPTS_COLLECTION, promptId);
    const promptDoc = await getDoc(promptDocRef);
    
    if (!promptDoc.exists()) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    const promptData = promptDoc.data();
    
    // Check if user owns this prompt
    if (promptData.userId !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized to access this prompt' });
    }
    
    // Return prompt data
    res.status(200).json({
      id: promptDoc.id,
      text: promptData.text,
      status: promptData.status,
      imageUrl: promptData.imageUrl || null,
      createdAt: promptData.createdAt,
      completedAt: promptData.completedAt || null
    });
  } catch (error) {
    console.error('Error getting prompt:', error);
    res.status(500).json({ message: 'Failed to get prompt' });
  }
};

/**
 * Get all prompts for the current user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getUserPrompts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Pagination parameters with validation
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50); // Maximum 50 items per page
    
    // Query prompts for user, sorted by creation date
    const promptsRef = collection(db, PROMPTS_COLLECTION);
    const q = query(
      promptsRef, 
      where('userId', '==', req.user.uid),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    const querySnapshot = await getDocs(q);
    
    const prompts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      prompts.push({
        id: doc.id,
        text: data.text,
        status: data.status,
        imageUrl: data.imageUrl || null,
        createdAt: data.createdAt,
        completedAt: data.completedAt || null
      });
    });
    
    // Return user's prompts
    res.status(200).json({ 
      prompts,
      pagination: {
        page,
        pageSize,
        total: prompts.length, // In a real app, you would implement proper pagination
        hasMore: prompts.length === pageSize
      }
    });
  } catch (error) {
    console.error('Error getting user prompts:', error);
    res.status(500).json({ message: 'Failed to get prompts' });
  }
};

/**
 * Get user's prompt usage statistics
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getPromptUsage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get user document
    const userDocRef = doc(db, USERS_COLLECTION, req.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    const promptUsage = userData.promptUsage || {
      count: 0,
      dailyCount: 0,
      lastUsed: null,
      dailyReset: null
    };
    
    // Return usage stats
    res.status(200).json({
      totalCount: promptUsage.count || 0,
      dailyCount: promptUsage.dailyCount || 0,
      dailyLimit: promptLimits.dailyLimit,
      lastUsed: promptUsage.lastUsed || null,
      dailyReset: promptUsage.dailyReset || null
    });
  } catch (error) {
    console.error('Error getting prompt usage:', error);
    res.status(500).json({ message: 'Failed to get prompt usage' });
  }
};

export { checkAndUpdatePromptLimits };
