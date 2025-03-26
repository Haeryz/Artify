import express from 'express';
import { 
  signup, 
  login,
  googleLogin, 
  logout, 
  getCurrentUser, 
  updateUserProfile,
  validateUserSession,
  changePassword
} from '../controllers/authentication.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { sessionMiddleware } from '../middleware/session.middleware.js';
import { ipBlocklistMiddleware, passwordStrengthMiddleware } from '../middleware/security.middleware.js';
import { validateRequest, schemas } from '../utils/validation.js';

const router = express.Router();

// Apply IP blocklist middleware to all routes
router.use(ipBlocklistMiddleware);

// Public routes (no auth required)
router.post('/signup', validateRequest(schemas.user.signup), passwordStrengthMiddleware, signup);
router.post('/login', validateRequest(schemas.user.login), login);
router.post('/google-login', googleLogin); // Add Google login route
router.post('/logout', logout);

// Protected routes (auth required)
router.get('/me', authMiddleware, sessionMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, sessionMiddleware, validateRequest(schemas.user.updateProfile), updateUserProfile);
router.get('/validate-session', authMiddleware, validateUserSession);
router.post('/change-password', authMiddleware, sessionMiddleware, validateRequest(schemas.user.changePassword), passwordStrengthMiddleware, changePassword);

export default router;
