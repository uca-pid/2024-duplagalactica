
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBISw1-CY6y05sHc6ZORaB8IZe5vkkzAvY",
  authDomain: "pid2024.firebaseapp.com",
  projectId: "pid2024",
  storageBucket: "pid2024.appspot.com",
  messagingSenderId: "791899624087",
  appId: "1:791899624087:web:8c863e909d51397a778fd2",
  measurementId: "G-4MY1QMB4E4"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firestore = getFirestore(app);
const auth = getAuth(app);
export { app, firestore,auth};
