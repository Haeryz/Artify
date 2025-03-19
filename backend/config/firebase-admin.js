import admin from 'firebase-admin';

// Check if environment variables are set
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

// Log Firebase configuration (without sensitive data)
console.log('Firebase Admin SDK initialization with:', {
  projectId: projectId,
  clientEmail: clientEmail ? clientEmail.substring(0, 10) + '...' : undefined,
  privateKeyProvided: privateKey ? true : false
});

// Ensure all required Firebase parameters are available
if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing required Firebase configuration parameters.');
  console.error('Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables are set.');
  throw new Error('Incomplete Firebase configuration');
}

// Initialize Firebase Admin SDK if not already initialized
let firebaseAdmin = null;
try {
  if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        // Fix for Azure: ensure proper newline handling
        privateKey: privateKey.replace(/\\n/g, '\n')
      })
    });
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    firebaseAdmin = admin.app();
    console.log('Using existing Firebase Admin SDK instance');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  throw error; // Re-throw to allow server.js to handle
}

export default firebaseAdmin;
