import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Only include client-side safe configuration values
// These values are already publicly visible in the browser so they are not sensitive
const firebaseConfig = {
  apiKey: "AIzaSyA3xvHRb-XRSnUZB2oEvmKAFXpqFe137ss",
  authDomain: "artify-32f50.firebaseapp.com",
  projectId: "artify-32f50",
  storageBucket: "artify-32f50.firebasestorage.app",
  messagingSenderId: "253207852255",
  appId: "1:253207852255:web:e0dc5068014d733b19656a"
};

// Initialize Firebase client SDK only for authentication
// This doesn't expose your backend configuration or server credentials
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Function to trigger Google sign-in popup and get ID token
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Get the ID token to send to your backend
    const idToken = await result.user.getIdToken();
    return { idToken };
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

export { auth };
