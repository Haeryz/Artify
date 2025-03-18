import admin from 'firebase-admin';
import { auth as clientAuth } from '../config/firebase.js';

// Initialize Firebase Admin once
if (!admin.apps.length) {
  try {
    // Check if environment variables are properly loaded
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY ? 
                       process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
                       undefined;
    
    // Log for debugging (remove in production)
    console.log("Firebase Admin SDK initialization with:", {
      projectId: projectId,
      clientEmail: clientEmail ? clientEmail.substring(0, 10) + '...' : undefined,
      privateKeyProvided: !!privateKey
    });
    
    // Validate required configuration
    if (!projectId || !clientEmail || !privateKey) {
      console.error("Missing Firebase Admin configuration:", {
        projectId: !projectId,
        clientEmail: !clientEmail,
        privateKey: !privateKey
      });
      throw new Error("Missing Firebase Admin configuration");
    }
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey
      })
    });
    
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    // Don't throw here, let the request handlers deal with it
  }
}

const authMiddleware = async (req, res, next) => {
  try {
    // Check if Firebase Admin is initialized
    if (admin.apps.length === 0) {
      return res.status(500).json({ message: 'Firebase Admin SDK not initialized' });
    }
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }
    
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token with Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (firebaseError) {
      console.error('Token verification error:', firebaseError);
      res.status(401).json({ message: 'Invalid or expired authentication token' });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ message: 'Authentication process failed' });
  }
};

export { authMiddleware };
