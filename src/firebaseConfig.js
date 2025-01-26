// src/firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv3CJ_UWWWt3jYski1_LPQdeqmx8uKLN4",
  authDomain: "taskflow-d4a96.firebaseapp.com",
  projectId: "taskflow-d4a96",
  storageBucket: "taskflow-d4a96.firebasestorage.app",
  messagingSenderId: "391567457568",
  appId: "1:391567457568:web:75d0448506c7f07a78ab45",
  measurementId: "G-RQBW4RL31V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase Auth and Google Provider
export const googleProvider = new GoogleAuthProvider();
export { auth, db, storage };

