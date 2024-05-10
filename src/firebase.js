import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "hirein-jp.firebaseapp.com",
  projectId: "hirein-jp",
  storageBucket: "hirein-jp.appspot.com",
  messagingSenderId: "524412551787",
  appId: "1:524412551787:web:9ffffcb2849e8d5c9ce72e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);