import { passwordPolicy, rateLimiting } from '../model/security.model.js';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';

// Collection to store login attempts
const LOGIN_ATTEMPTS_COLLECTION = 'login_attempts';
const IP_BLOCKLIST_COLLECTION = 'ip_blocklist';

/**
 * Validates password strength according to password policy
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result and message
 */
export const validatePasswordStrength = (password) => {
  const result = {
    valid: true,
    message: 'Password meets requirements'
  };

  if (!password || password.length < passwordPolicy.minLength) {
    result.valid = false;
    result.message = `Password must be at least ${passwordPolicy.minLength} characters`;
    return result;
  }

  if (password.length > passwordPolicy.maxLength) {
    result.valid = false;
    result.message = `Password must be less than ${passwordPolicy.maxLength} characters`;
    return result;
  }

  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    result.valid = false;
    result.message = 'Password must contain at least one lowercase letter';
    return result;
  }

  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    result.valid = false;
    result.message = 'Password must contain at least one uppercase letter';
    return result;
  }

  if (passwordPolicy.requireNumber && !/[0-9]/.test(password)) {
    result.valid = false;
    result.message = 'Password must contain at least one number';
    return result;
  }

  if (passwordPolicy.requireSpecialChar && !/[^A-Za-z0-9]/.test(password)) {
    result.valid = false;
    result.message = 'Password must contain at least one special character';
    return result;
  }

  return result;
};

/**
 * Tracks login attempts to prevent brute force attacks
 * @param {string} email - The email attempting login
 * @param {string} ipAddress - The IP address of the request
 * @param {boolean} isSuccessful - Whether the login was successful
 */
export const trackLoginAttempt = async (email, ipAddress, isSuccessful) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const docRef = doc(db, LOGIN_ATTEMPTS_COLLECTION, normalizedEmail);
    const docSnap = await getDoc(docRef);
    
    const currentTime = Date.now();
    const windowTime = currentTime - rateLimiting.loginWindowMs;
    
    let attempts = [];
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      attempts = data.attempts || [];
      
      // Filter out old attempts
      attempts = attempts.filter(attempt => attempt.timestamp > windowTime);
    }
    
    // Add current attempt
    attempts.push({
      timestamp: currentTime,
      ipAddress: ipAddress,
      successful: isSuccessful
    });
    
    // Store updated attempts
    await setDoc(docRef, {
      email: normalizedEmail,
      attempts: attempts,
      lastUpdated: serverTimestamp()
    });
    
    // Check if IP should be blocked
    const ipAttempts = attempts.filter(attempt => 
      attempt.ipAddress === ipAddress && !attempt.successful
    ).length;
    
    if (ipAttempts >= rateLimiting.loginMaxAttempts) {
      await setDoc(doc(db, IP_BLOCKLIST_COLLECTION, ipAddress), {
        ipAddress: ipAddress,
        blockedUntil: new Date(currentTime + rateLimiting.loginWindowMs),
        reason: 'Too many failed login attempts',
        createdAt: serverTimestamp()
      });
      
      console.warn(`IP ${ipAddress} has been blocked for too many failed login attempts`);
    }
    
    return attempts.filter(attempt => !attempt.successful).length;
  } catch (error) {
    console.error('Error tracking login attempt:', error);
    return 0;
  }
};

/**
 * Middleware to check if IP is blocked
 */
export const ipBlocklistMiddleware = async (req, res, next) => {
  try {
    const ipAddress = req.ip || 
                      req.connection.remoteAddress || 
                      req.headers['x-forwarded-for']?.split(',')[0].trim();
    
    if (!ipAddress) {
      console.warn('Could not determine IP address');
      return next();
    }
    
    // Check if IP is in blocklist
    const docRef = doc(db, IP_BLOCKLIST_COLLECTION, ipAddress);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Check if block is still active
      if (data.blockedUntil.toDate() > new Date()) {
        return res.status(429).json({ 
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((data.blockedUntil.toDate() - new Date()) / 1000)
        });
      } else {
        // Block expired, remove from blocklist
        await deleteDoc(docRef);
      }
    }
    
    // Add IP to request object for tracking
    req.clientIp = ipAddress;
    next();
  } catch (error) {
    console.error('Error in IP blocklist middleware:', error);
    next();
  }
};

/**
 * Middleware to validate password strength
 */
export const passwordStrengthMiddleware = (req, res, next) => {
  const { password } = req.body;
  
  // Skip for routes that don't need password validation
  if (!password || req.path === '/login') {
    return next();
  }
  
  const validationResult = validatePasswordStrength(password);
  
  if (!validationResult.valid) {
    return res.status(400).json({ 
      message: validationResult.message,
      code: 'WEAK_PASSWORD' 
    });
  }
  
  next();
};
