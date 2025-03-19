import rateLimit from 'express-rate-limit';
import { rateLimiting } from '../model/security.model.js';

// Create a store to keep track of requests (in-memory by default)
// For production, consider using a more robust store like Redis

// Global rate limiter - applies to all routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500, // limit each IP to 500 requests per windowMs
  standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: 'Too many requests from this IP, please try again later',
    retryAfter: 15 * 60 // in seconds
  }
});

// Auth endpoints limiter - more strict for auth routes
export const authLimiter = rateLimit({
  windowMs: rateLimiting.loginWindowMs, // 15 minutes from your security model
  limit: 20, // limit each IP to 20 requests per windowMs for auth endpoints
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts, please try again later',
    retryAfter: Math.floor(rateLimiting.loginWindowMs / 1000) // convert ms to seconds
  }
});

// API endpoints limiter - for other API routes
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many API requests from this IP, please try again later',
    retryAfter: 10 * 60 // in seconds
  }
});

// Health check endpoints limiter - allows more frequent health checks
export const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // limit each IP to 10 health check requests per minute
  standardHeaders: 'draft-7',
  legacyHeaders: false
});
