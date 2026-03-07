import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDtr09eDrxKmT-3JjGA8O8nwanNg7-5foI",
    authDomain: "shopsphere-46c5c.firebaseapp.com",
    projectId: "shopsphere-46c5c",
    storageBucket: "shopsphere-46c5c.firebasestorage.app",
    messagingSenderId: "615432077221",
    appId: "1:615432077221:web:060727d648f663836eb24c",
    measurementId: "G-8NN6B9C7C6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
