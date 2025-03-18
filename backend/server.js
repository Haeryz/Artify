// Load environment variables first
import './config/env.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Add helmet for security headers
import authRoutes from './routes/authentication.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { sessionMiddleware } from './middleware/session.middleware.js';
import { ipBlocklistMiddleware } from './middleware/security.middleware.js';

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
app.use(ipBlocklistMiddleware);

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running');
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
