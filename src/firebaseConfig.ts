// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-key-for-build",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log("Environment variables check:", {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Found" : "❌ Missing",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    ? "✅ Found"
    : "❌ Missing",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ? "✅ Found"
    : "❌ Missing",
});

/* eslint-disable @typescript-eslint/no-explicit-any */
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
/* eslint-enable @typescript-eslint/no-explicit-any */

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initiallized successfully");
  } catch (error) {
    console.log("Could not initialize firebase: ", error);
  }
} else {
  console.log("❌ Firebase initialization skipped - missing requirements");
}

console.log("Final Firebase state:", {
  hasWindow: typeof window !== "undefined",
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  dbInitialized: !!db,
});

export { db, auth, storage };
