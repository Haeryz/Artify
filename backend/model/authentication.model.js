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
  // Prompt usage tracking
  promptUsage: {
    count: Number,       // Total number of prompts used
    dailyCount: Number,  // Daily usage count
    lastUsed: Date,      // Last time a prompt was used
    dailyReset: Date     // When the daily count was last reset
  },
  // Add any other fields you want to store in Firestore
};

// Collection name in Firestore
const USERS_COLLECTION = 'users';

export { userModel, USERS_COLLECTION };
