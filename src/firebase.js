import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBuw_JscywM4nx9GvxdgI4SJ4ZxkDlfQVE",
    authDomain: "kids-tracker-32a26.firebaseapp.com",
    projectId: "kids-tracker-32a26",
    storageBucket: "kids-tracker-32a26.firebasestorage.app",
    messagingSenderId: "905390252092",
    appId: "1:905390252092:web:9E9dfbae399f0546042339"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
