import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (result.error) {
  console.error("Error loading .env file:", result.error);
}

// Log loaded environment variables (excluding sensitive data)
console.log("Environment loaded:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Not set",
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? "✓ Set" : "✗ Not set",
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? "✓ Set" : "✗ Not set"
});

export default result;
