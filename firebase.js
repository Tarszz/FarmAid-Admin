import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2_a91SdWfX5eVihs2wKb5MjZVVq58seg",
  authDomain: "farmaid-21053.firebaseapp.com",
  databaseURL: "https://farmaid-21053-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "farmaid-21053",
  storageBucket: "farmaid-21053.appspot.com",
  messagingSenderId: "822952482588",
  appId: "1:822952482588:web:74a55c97e58c797e5dccd9",
  measurementId: "G-EQ0D2XM5MX"
};

// Initialize only if no apps initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { db };
