import express from 'express';
import { 
  generateImage, 
  getPrompt, 
  getUserPrompts, 
  getPromptUsage 
} from '../controllers/prompt.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { sessionMiddleware } from '../middleware/session.middleware.js';
import { validateRequest, schemas, isValidDocumentId } from '../utils/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware, sessionMiddleware);

// Generate image from prompt - validate input
router.post('/generate', validateRequest(schemas.prompt.create), generateImage);

// Middleware to validate promptId parameter
const validatePromptId = (req, res, next) => {
  const { promptId } = req.params;
  
  if (!isValidDocumentId(promptId)) {
    return res.status(400).json({ 
      message: 'Invalid prompt ID format' 
    });
  }
  
  next();
};

// Get a specific prompt by ID - validate ID parameter
router.get('/:promptId', validatePromptId, getPrompt);

// Get all prompts for the current user
router.get('/', getUserPrompts);

// Get user's prompt usage statistics
router.get('/usage/stats', getPromptUsage);

export default router;
