// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3xvHRb-XRSnUZB2oEvmKAFXpqFe137ss",
  authDomain: "artify-32f50.firebaseapp.com",
  projectId: "artify-32f50",
  storageBucket: "artify-32f50.firebasestorage.app",
  messagingSenderId: "253207852255",
  appId: "1:253207852255:web:e0dc5068014d733b19656a",
  measurementId: "G-ZBRHQV4PRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);