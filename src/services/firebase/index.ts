import 'dotenv/config'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtyidyfBsJedWQJl4xUOv-PI3saVNne44",
  authDomain: "emagre-development.firebaseapp.com",
  projectId: "emagre-development",
  storageBucket: "emagre-development.appspot.com",
  messagingSenderId: "662697044324",
  appId: "1:662697044324:web:8f64ff08a593f4e504b271",
  measurementId: "G-1BCE40CWTJ"
};

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };
//

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
