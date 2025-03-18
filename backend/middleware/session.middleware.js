import admin from 'firebase-admin';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { sessionSecurity } from '../model/security.js';

// Session collection in Firestore
const SESSION_COLLECTION = 'sessions';

/**
 * Creates or updates a session for the user
 * @param {string} userId - The user's Firebase UID
 * @param {string} token - The authentication token
 * @param {string} ipAddress - The IP address of the request
 * @param {string} userAgent - The user agent string
 */
export const createSession = async (userId, token, ipAddress = null, userAgent = null) => {
  try {
    // Create a session document with enhanced security
    await setDoc(doc(db, SESSION_COLLECTION, userId), {
      userId,
      token: token ? await encryptToken(token) : null, // Consider encrypting tokens
      lastActivity: serverTimestamp(),
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + sessionSecurity.expiryTimeMs),
      ipAddress,
      userAgent,
      deviceInfo: parseUserAgent(userAgent)
    });

    console.log(`Session created for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error creating session:', error);
    return false;
  }
};

// Simple utility function to parse user agent
const parseUserAgent = (userAgent) => {
  if (!userAgent) return null;
  
  const info = {
    browser: 'Unknown',
    os: 'Unknown',
    device: 'Unknown'
  };
  
  // Simple parsing (in production use a proper library)
  if (userAgent.includes('Firefox')) info.browser = 'Firefox';
  else if (userAgent.includes('Chrome')) info.browser = 'Chrome';
  else if (userAgent.includes('Safari')) info.browser = 'Safari';
  else if (userAgent.includes('Edge')) info.browser = 'Edge';
  
  if (userAgent.includes('Windows')) info.os = 'Windows';
  else if (userAgent.includes('Mac')) info.os = 'MacOS';
  else if (userAgent.includes('iPhone')) info.os = 'iOS';
  else if (userAgent.includes('Android')) info.os = 'Android';
  else if (userAgent.includes('Linux')) info.os = 'Linux';
  
  if (userAgent.includes('Mobile')) info.device = 'Mobile';
  else if (userAgent.includes('Tablet')) info.device = 'Tablet';
  else info.device = 'Desktop';
  
  return info;
};

/**
 * Updates user's last activity timestamp
 * @param {string} userId - The user's Firebase UID
 */
export const updateSessionActivity = async (userId) => {
  try {
    // Update last activity timestamp and reset inactivity timer
    await updateDoc(doc(db, SESSION_COLLECTION, userId), {
      lastActivity: serverTimestamp(),
      expiresAt: new Date(Date.now() + sessionSecurity.expiryTimeMs)
    });
    return true;
  } catch (error) {
    console.error('Error updating session activity:', error);
    return false;
  }
};

/**
 * Validates if the user's session is still active
 * @param {string} userId - The user's Firebase UID
 * @param {string} ipAddress - IP address to validate against the session
 */
export const validateSession = async (userId, ipAddress = null) => {
  try {
    // Get session document
    const sessionDoc = await getDoc(doc(db, SESSION_COLLECTION, userId));
    
    // If no session exists, session is invalid
    if (!sessionDoc.exists()) {
      return false;
    }

    const session = sessionDoc.data();

    // Check if session is expired (global expiry)
    if (session.expiresAt && session.expiresAt.toDate() < new Date()) {
      console.log(`Session expired for user: ${userId}`);
      await deleteSession(userId);
      return false;
    }

    // Check for inactivity timeout
    if (session.lastActivity) {
      const lastActivity = session.lastActivity.toDate();
      const inactivityCutoff = new Date(Date.now() - sessionSecurity.inactivityTimeoutMs);
      
      if (lastActivity < inactivityCutoff) {
        console.log(`Session inactive for too long: ${userId}`);
        await deleteSession(userId);
        return false;
      }
    }

    // Optionally verify IP hasn't changed (security feature)
    if (ipAddress && session.ipAddress && ipAddress !== session.ipAddress) {
      console.warn(`IP address changed for user ${userId}. Potential session hijacking.`);
      // In production, you might want to invalidate the session here
      // For now, just log the warning but don't invalidate
    }

    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
};

// Placeholder for token encryption (implement with a proper encryption library)
const encryptToken = async (token) => {
  // In production, use a proper encryption method
  // For now, just return the token
  return token;
};

/**
 * Deletes a user's session
 * @param {string} userId - The user's Firebase UID
 */
export const deleteSession = async (userId) => {
  try {
    // Delete the session document
    await deleteDoc(doc(db, SESSION_COLLECTION, userId));
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
};

/**
 * Middleware to validate user session with enhanced security
 */
export const sessionMiddleware = async (req, res, next) => {
  try {
    // Skip for non-authenticated routes
    if (!req.user) {
      return next();
    }

    const userId = req.user.uid;
    const ipAddress = req.clientIp || req.ip;

    // Validate if session exists and is not expired
    const isValid = await validateSession(userId, ipAddress);
    
    if (!isValid) {
      return res.status(401).json({ 
        message: 'Session expired. Please login again.',
        code: 'SESSION_EXPIRED' 
      });
    }
    
    // Update last activity time
    await updateSessionActivity(userId);
    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    next();
  }
};
