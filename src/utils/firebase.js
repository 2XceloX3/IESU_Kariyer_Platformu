import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDEg5xrEJn4rXXgNGwcLaj0rvsbsaEfHOM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "iesu-kariyer-platformu.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "iesu-kariyer-platformu",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "iesu-kariyer-platformu.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "824023340526",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:824023340526:web:e5c13c207a0e00bf6caaff",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TNSHH35QYT",
};

let app;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn('[Firebase] Initialization fallback warning:', e);
  app = initializeApp(firebaseConfig);
}

// Analytics is intentionally opt-in.
export const analytics = null;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
