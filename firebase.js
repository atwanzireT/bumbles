import { initializeApp } from "firebase/app";
import {getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnjaqhp4CpJhfmhe57zrJuc0SkWdy_1fc",
  authDomain: "bumbles-8a07d.firebaseapp.com",
  projectId: "bumbles-8a07d",
  storageBucket: "bumbles-8a07d.appspot.com",
  messagingSenderId: "242901372699",
  appId: "1:242901372699:web:852d6bbbfc872c65cbcdbe"
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const firebase_auth = getAuth(firebase_app);
const firebase_db = getFirestore(firebase_app);

export {
  firebase_app,
  firebase_auth,
  firebase_db,
}