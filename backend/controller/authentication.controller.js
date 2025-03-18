import { auth, db } from '../config/firebase.js';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { USERS_COLLECTION } from '../model/authentication.js';

// Register a new user
const signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
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
      lastLogin: serverTimestamp()
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

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user from Firestore
    const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update last login time
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
    } else {
      // Create user in Firestore if not exists (rare case)
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || email.split('@')[0],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
    }

    // Get ID token
    const token = await firebaseUser.getIdToken();
    
    // Return user data and token
    res.status(200).json({ 
      message: 'Login successful',
      token,
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userDoc.exists() ? userDoc.data().displayName : (firebaseUser.displayName || email.split('@')[0])
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    
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

export { signup, login, logout, getCurrentUser, updateUserProfile };
