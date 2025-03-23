/**
 * Prompt model structure for Firestore
 * This file defines the structure of prompt documents in Firestore
 */

// Collection names
const PROMPTS_COLLECTION = 'prompts';

// Prompt data structure
const promptModel = {
  userId: String,           // User who created the prompt
  text: String,             // The prompt text
  imageUrl: String,         // URL to the generated image
  status: String,           // Status: pending, completed, failed
  createdAt: Date,          // When the prompt was created
  completedAt: Date,        // When the image was generated
  generationConfig: Object, // Configuration used for generation
  metadata: Object          // Additional metadata
};

// User prompt limits
const promptLimits = {
  dailyLimit: 10,          // Maximum prompts per day per user
  defaultTemperature: 2,   // Default temperature value
  defaultTopP: 0.95,       // Default topP value
  defaultTopK: 40,         // Default topK value
  maxLength: 200           // Maximum prompt length in characters
};

export { promptModel, PROMPTS_COLLECTION, promptLimits };
