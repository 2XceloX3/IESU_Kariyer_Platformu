import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEg5xrEJn4rXXgNGwcLaj0rvsbsaEfHOM",
  authDomain: "iesu-kariyer-platformu.firebaseapp.com",
  projectId: "iesu-kariyer-platformu",
  storageBucket: "iesu-kariyer-platformu.firebasestorage.app",
  messagingSenderId: "824023340526",
  appId: "1:824023340526:web:e5c13c207a0e00bf6caaff",
  measurementId: "G-TNSHH35QYT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances to be used across the app
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
