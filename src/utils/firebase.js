import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEg5xrEJn4rXXgNGwcLaj0rvsbsaEfHOM",
  authDomain: "igu-kariyer-platformu.firebaseapp.com",
  projectId: "igu-kariyer-platformu",
  storageBucket: "igu-kariyer-platformu.firebasestorage.app",
  messagingSenderId: "824023340526",
  appId: "1:824023340526:web:e5c13c207a0e00bf6caaff",
  measurementId: "G-TNSHH35QYT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Safe export for Analytics to prevent local development/adblocker crashes
let analyticsInstance = null;
isSupported().then((supported) => {
  if (supported) {
    try {
      analyticsInstance = getAnalytics(app);
    } catch (err) {
      console.warn("Firebase Analytics could not be initialized:", err);
    }
  }
}).catch(() => {
  console.warn("Firebase Analytics is not supported in this environment.");
});

export const analytics = analyticsInstance;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
