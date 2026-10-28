// @ts-check
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const isTestEnv =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  (import.meta.env.MODE === "test" || Boolean(import.meta.env.VITEST));

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || (isTestEnv ? "test-api-key" : undefined),
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || (isTestEnv ? "iesu-test.firebaseapp.com" : undefined),
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || (isTestEnv ? "iesu-kariyer-platformu" : undefined),
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || (isTestEnv ? "iesu-test.firebasestorage.app" : undefined),
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || (isTestEnv ? "000000000000" : undefined),
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || (isTestEnv ? "1:000000000000:web:test" : undefined),
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

let app = null;
let _db = null;
let _auth = null;
let _storage = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
} catch (e) {
  try {
    app = initializeApp(firebaseConfig, "iesu-fallback-" + Date.now());
  } catch (_) {
    app = null;
  }
}

try { _db = app ? getFirestore(app) : null; } catch (_) {}
try { _auth = app ? getAuth(app) : null; } catch (_) {}
try { _storage = app ? getStorage(app) : null; } catch (_) {}

export const analytics = null;
export const db = _db;
export const auth = _auth;
export const storage = _storage;
export default app;
