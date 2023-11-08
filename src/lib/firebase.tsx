import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB6AIST_y7t-XEPHz0qa6e454N3Kd8CMYQ",
    authDomain: "simccba.firebaseapp.com",
    projectId: "simccba",
    storageBucket: "simccba.appspot.com",
    messagingSenderId: "735553101030",
    appId: "1:735553101030:web:a3047174edf45a52f0ef27",
    measurementId: "G-HDJHKXTCFC"
  };


  const app = initializeApp(firebaseConfig)
  export const auth = getAuth(app)