
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCXwHZO56T1xnoK2XNR3nDwWj5NVbJ6Ltk",
  authDomain: "pid22-40703.firebaseapp.com",
  projectId: "pid22-40703",
  storageBucket: "pid22-40703.appspot.com",
  messagingSenderId: "200419985545",
  appId: "1:200419985545:web:24380ac9b1fd4aedaa5e58",
  measurementId: "G-FJS582T4TQ"
};



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firestore = getFirestore(app);
const auth = getAuth(app);
export { app, firestore,auth};
