// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzmb_S-sZAvWF_UHI-Ldf1lKarjL_RPBs",
  authDomain: "sport-app-75a3f.firebaseapp.com",
  databaseURL: "https://sport-app-75a3f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sport-app-75a3f",
  storageBucket: "sport-app-75a3f.firebasestorage.app",
  messagingSenderId: "903452243767",
  appId: "1:903452243767:web:d040c1ec6a973cc7930cb2",
  measurementId: "G-SXCPXKD974"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);