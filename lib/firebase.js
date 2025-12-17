import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN0XAEhR4gGt1us4u-mSQVYk9-Y2p7KTU",
  authDomain: "crypto-recovery-1f3b8.firebaseapp.com",
  projectId: "crypto-recovery-1f3b8",
  storageBucket: "crypto-recovery-1f3b8.firebasestorage.app",
  messagingSenderId: "757955597640",
  appId: "1:757955597640:web:7c3708c9c129c2c6990f7d",
  measurementId: "G-1RBW4XJNW4"
};

// Prevent re-initializing Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
