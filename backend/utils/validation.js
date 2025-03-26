import validator from 'validator';
import Joi from 'joi';

/**
 * Utility functions for input validation and sanitization
 * These help prevent NoSQL injection and other input validation vulnerabilities
 */

/**
 * Sanitizes a string input to prevent injection attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return validator.escape(input.trim());
};

/**
 * Sanitizes an email address
 * @param {string} email - The email to sanitize
 * @returns {string} - The sanitized and normalized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
};

/**
 * Sanitizes an object's string properties recursively
 * @param {object} obj - The object to sanitize
 * @returns {object} - A new object with sanitized string properties
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Joi validation schemas
export const schemas = {
  // User validation schemas
  user: {
    signup: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(128).required(),
      displayName: Joi.string().min(2).max(50).required()
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    updateProfile: Joi.object({
      displayName: Joi.string().min(2).max(50),
      photoURL: Joi.string().uri().allow(null, ''),
      bio: Joi.string().max(500).allow(null, '')
    }),
    changePassword: Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(8).max(128).required()
    })
  },
  
  // Prompt validation schemas
  prompt: {
    create: Joi.object({
      prompt: Joi.string().min(1).max(5000).required(),
      model: Joi.string().required(),
      options: Joi.object().allow(null)
    })
  }
};

/**
 * Middleware for validating request data against Joi schemas
 * @param {Joi.Schema} schema - The Joi schema to validate against
 * @returns {Function} - Express middleware function
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: errorMessages
      });
    }
    
    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

/**
 * Validates MongoDB/Firestore document IDs to prevent injection
 * @param {string} id - The document ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export const isValidDocumentId = (id) => {
  if (!id || typeof id !== 'string') return false;
  
  // For Firestore document IDs (alphanumeric, hyphens, underscores)
  return validator.isAlphanumeric(id.replace(/[-_]/g, 'a'));
};