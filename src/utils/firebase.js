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
let _db = null;
let _auth = null;
let _storage = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn('[Firebase] Initialization fallback warning:', e);
  try {
    app = initializeApp(firebaseConfig, 'iesu-fallback-' + Date.now());
  } catch (e2) {
    console.error('[Firebase] Fatal: app initialization failed', e2);
    app = null;
  }
}

try { _db = app ? getFirestore(app) : null; } catch (e) { console.warn('[Firebase] Firestore init failed:', e?.message); }
try { _auth = app ? getAuth(app) : null; } catch (e) { console.warn('[Firebase] Auth init failed:', e?.message); }
try { _storage = app ? getStorage(app) : null; } catch (e) { console.warn('[Firebase] Storage init failed:', e?.message); }

// Analytics is intentionally opt-in.
export const analytics = null;
export const db = _db;
export const auth = _auth;
export const storage = _storage;
export default app;
