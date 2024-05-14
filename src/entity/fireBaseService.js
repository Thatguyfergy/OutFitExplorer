// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtJfoEL9oAteJDUf5hPo6_90oHUxqWDfI",
  authDomain: "sc2006-416516.firebaseapp.com",
  projectId: "sc2006-416516",
  storageBucket: "sc2006-416516.appspot.com",
  messagingSenderId: "829925192114",
  appId: "1:829925192114:web:3e870843ad746b7e7974ab",
  measurementId: "G-0RTLJCERKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, analytics };