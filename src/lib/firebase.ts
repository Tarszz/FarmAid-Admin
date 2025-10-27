
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC2_a91SdWfX5eVihs2wKb5MjZVVq58seg",
  authDomain: "farmaid-21053.firebaseapp.com",
  databaseURL: "https://farmaid-21053-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "farmaid-21053",
  storageBucket: "farmaid-21053.firebasestorage.app",
  messagingSenderId: "822952482588",
  appId: "1:822952482588:web:74a55c97e58c797e5dccd9",
  measurementId: "G-EQ0D2XM5MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, auth, storage, analytics };
