import admin from 'firebase-admin';
import { auth, db } from '../config/firebase.js';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { USERS_COLLECTION } from '../model/authentication.js';
import { createSession, deleteSession, validateSession } from '../middleware/session.middleware.js';
import { validatePasswordStrength, trackLoginAttempt } from '../middleware/security.middleware.js';

// Register a new user
const signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        message: passwordValidation.message,
        code: 'WEAK_PASSWORD' 
      });
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Prepare user data for Firestore
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: displayName || email.split('@')[0],
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      securityInfo: {
        passwordLastChanged: new Date(),
        accountCreationIp: req.clientIp || req.ip || 'unknown',
        accountCreationUserAgent: req.headers['user-agent'] || 'unknown'
      }
    };

    // Store user in Firestore
    await setDoc(doc(db, USERS_COLLECTION, firebaseUser.uid), userData);

    // Return success response (excluding sensitive data)
    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userData.displayName
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    let errorMessage = 'Failed to create user';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email is already in use';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email is invalid';
    }
    
    res.status(400).json({ message: errorMessage });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.clientIp || req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Track login attempt and check for too many attempts
    const failedAttempts = await trackLoginAttempt(email, ipAddress, false);
    if (failedAttempts >= 5) {
      return res.status(429).json({ 
        message: 'Too many failed login attempts. Please try again later.',
        retryAfter: 900 // 15 minutes in seconds
      });
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Record successful login
    await trackLoginAttempt(email, ipAddress, true);

    // Get user from Firestore
    const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    // Update security info
    const securityInfo = {
      lastLoginIp: ipAddress,
      lastLoginUserAgent: userAgent,
      lastLoginTime: new Date(),
      loginCount: (userDoc.exists() && userDoc.data().securityInfo?.loginCount || 0) + 1
    };

    if (userDoc.exists()) {
      // Update last login time and security info
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp(),
        'securityInfo.lastLoginIp': ipAddress,
        'securityInfo.lastLoginUserAgent': userAgent,
        'securityInfo.lastLoginTime': serverTimestamp(),
        'securityInfo.loginCount': securityInfo.loginCount
      });
    } else {
      // Create user in Firestore if not exists (rare case)
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || email.split('@')[0],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        securityInfo: {
          ...securityInfo,
          passwordLastChanged: new Date(),
          accountCreationIp: ipAddress,
          accountCreationUserAgent: userAgent
        }
      });
    }

    // Get ID token
    const token = await firebaseUser.getIdToken();
    
    // Create user session with device info
    await createSession(firebaseUser.uid, token, ipAddress, userAgent);
    
    // Return user data and token
    res.status(200).json({ 
      message: 'Login successful',
      token,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userDoc.exists() ? userDoc.data().displayName : (firebaseUser.displayName || email.split('@')[0])
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    
    // Track failed login attempt
    try {
      const ipAddress = req.clientIp || req.ip || 'unknown';
      await trackLoginAttempt(req.body.email || '', ipAddress, false);
    } catch (trackingError) {
      console.error('Error tracking failed login:', trackingError);
    }
    
    let errorMessage = 'Failed to login';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Try again later';
    }
    
    res.status(401).json({ message: errorMessage });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        // Verify the token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Delete the session
        await deleteSession(decodedToken.uid);
      } catch (error) {
        console.error('Error verifying token during logout:', error);
      }
    }
    
    await signOut(auth);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Get user data from Firestore
    const userDocRef = doc(db, USERS_COLLECTION, req.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();

    res.status(200).json({ 
      user: {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        // Include other non-sensitive user data as needed
      }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Failed to get user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { displayName } = req.body;
    
    // Only allow updating specific fields
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    
    // If there's nothing to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    // Update Firestore document
    const userDocRef = doc(db, USERS_COLLECTION, req.user.uid);
    await updateDoc(userDocRef, updateData);
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      updates: updateData
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Validate session status and refresh if needed
const validateUserSession = async (req, res) => {
  try {
    const { uid } = req.user;
    
    if (!uid) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Check if session is valid
    const isValid = await validateSession(uid);
    
    if (!isValid) {
      return res.status(401).json({ 
        message: 'Session expired',
        valid: false,
        code: 'SESSION_EXPIRED'
      });
    }
    
    res.status(200).json({ 
      message: 'Session is valid',
      valid: true
    });
  } catch (error) {
    console.error('Error validating session:', error);
    res.status(500).json({ message: 'Failed to validate session' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        message: passwordValidation.message,
        code: 'WEAK_PASSWORD' 
      });
    }

    // Re-authenticate user to verify current password
    try {
      // Firebase doesn't have a direct "verify password" method
      // This is a workaround using signIn with email and current password
      const email = req.user.email;
      await signInWithEmailAndPassword(auth, email, currentPassword);
      
      // Change password
      const currentUser = auth.currentUser;
      await updatePassword(currentUser, newPassword);

      // Update password change timestamp in Firestore
      const userDocRef = doc(db, USERS_COLLECTION, req.user.uid);
      await updateDoc(userDocRef, {
        'securityInfo.passwordLastChanged': serverTimestamp()
      });

      // Invalidate all existing sessions except current one
      // In production, you might want to implement this feature

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (authError) {
      console.error('Authentication error during password change:', authError);
      res.status(401).json({ message: 'Current password is incorrect' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

export { 
  signup, 
  login, 
  logout, 
  getCurrentUser, 
  updateUserProfile, 
  validateUserSession,
  changePassword 
};
