import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Load environment variables from .env file if it exists
let result = { parsed: {} };
if (fs.existsSync(envPath)) {
  result = dotenv.config({ path: envPath });
  if (result.error) {
    console.warn("Error loading .env file:", result.error.message);
    console.warn("The application will use environment variables from the system/container");
  } else {
    console.log("Environment variables loaded from .env file");
  }
} else {
  console.log("No .env file found, using system/container environment variables");
}

// Log loaded environment variables (excluding sensitive data)
console.log("Environment loaded:", {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Not set",
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? "✓ Set" : "✗ Not set",
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? "✓ Set" : "✗ Not set"
});

export default result;
