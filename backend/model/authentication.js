/**
 * User model structure for Firestore
 * This file doesn't create a MongoDB model but defines the structure
 * of user documents in Firestore
 */

// Define user data structure - this helps with TypeScript and documentation
const userModel = {
  uid: String, // Firebase Auth UID
  email: String,
  displayName: String,
  createdAt: Date,
  lastLogin: Date,
  // Add any other fields you want to store in Firestore
};

// Collection name in Firestore
const USERS_COLLECTION = 'users';

export { userModel, USERS_COLLECTION };
