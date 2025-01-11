// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



// Remplace les valeurs ci-dessous par celles de ta console Firebase
export const firebaseConfig = {
    apiKey: "AIzaSyDFe5Nfrwc5TJ7CuhUbDSVoftClLElELrE",
    authDomain: "kit4cause-b7a41.firebaseapp.com",
    projectId: "kit4cause-b7a41",
    storageBucket: "kit4cause-b7a41.firebasestorage.app",
    messagingSenderId: "640590726846",
    appId: "1:640590726846:web:3e6c14135ce950778040ef"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);


// Exportation des services pour les utiliser dans ton projet
export const auth = getAuth(app);
export const db = getFirestore(app);