import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  getCurrentUser, 
  updateUserProfile 
} from '../controller/authentication.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (auth required)
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateUserProfile);

export default router;
