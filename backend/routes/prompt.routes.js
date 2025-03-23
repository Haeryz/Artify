import express from 'express';
import { 
  generateImage, 
  getPrompt, 
  getUserPrompts, 
  getPromptUsage 
} from '../controllers/prompt.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { sessionMiddleware } from '../middleware/session.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware, sessionMiddleware);

// Generate image from prompt
router.post('/generate', generateImage);

// Get a specific prompt by ID
router.get('/:promptId', getPrompt);

// Get all prompts for the current user
router.get('/', getUserPrompts);

// Get user's prompt usage statistics
router.get('/usage/stats', getPromptUsage);

export default router;
