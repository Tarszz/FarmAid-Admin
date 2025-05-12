// src/lib/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2_a91SdWfX5eVihs2wKb5MjZVVq58seg",
  authDomain: "farmaid-21053.firebaseapp.com",
  projectId: "farmaid-21053",
  storageBucket: "farmaid-21053.firebasestorage.app",
  messagingSenderId: "822952482588",
  appId: "1:822952482588:web:74a55c97e58c797e5dccd9",
  measurementId: "G-EQ0D2XM5MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Firestore & Auth exports
export const db = getFirestore(app);
export const auth = getAuth(app);
