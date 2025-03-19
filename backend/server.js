// Load environment variables first
import './config/env.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Add helmet for security headers
import authRoutes from './routes/authentication.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { sessionMiddleware } from './middleware/session.middleware.js';
import { ipBlocklistMiddleware } from './middleware/security.middleware.js';
import { globalLimiter, authLimiter, apiLimiter, healthLimiter } from './middleware/rate-limit.middleware.js';

// Try to import Firebase admin
let firebaseAdmin = null;
try {
  const adminModule = await import('./config/firebase-admin.js');
  firebaseAdmin = adminModule.default;
  console.log('Firebase Admin SDK imported successfully');
} catch (error) {
  console.error('Failed to import Firebase Admin SDK:', error.message);
  console.error('Application will continue without Firebase Admin functionality');
}

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600
}));

// Standard middleware
app.use(express.json({ limit: '1mb' })); // Limit request size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting for all routes
app.use(globalLimiter); // Apply global rate limiting first

// IP blocklist middleware
app.use(ipBlocklistMiddleware);

// Apply rate limiters to specific routes
app.use('/api/auth', authLimiter); // Apply stricter limits to auth routes
app.use('/api', apiLimiter); // Apply API rate limits to all API routes
app.use('/health', healthLimiter); // Apply separate limiter for health checks

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Health check route for monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    firebase: firebaseAdmin ? 'initialized' : 'not initialized',
    timestamp: new Date().toISOString()
  });
});

// Protected example route
app.get('/api/protected', authMiddleware, sessionMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
