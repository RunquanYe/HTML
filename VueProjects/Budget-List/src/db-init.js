import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

/***************************
 * Author: Runquan Ye
 **************************/

// Your web app's Firebase configuration
var firebaseConfig = {
  /* content from your Firebase Dashboard */
  apiKey: "AIzaSyC4OoxY-FB9ZmqrVKFcpfKWGEfAb8EFp5Y",
  authDomain: "cis371hw5.firebaseapp.com",
  databaseURL: "https://cis371hw5.firebaseio.com",
  projectId: "cis371hw5",
  storageBucket: "cis371hw5.appspot.com",
  messagingSenderId: "415861792480",
  appId: "1:415861792480:web:32abe5c79be30315fa7a85",
  measurementId: "G-CFQTDJJHL7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const AppDB = firebase.database();
const AppAUTH = firebase.auth(); // add this line
export { AppDB, AppAUTH };
