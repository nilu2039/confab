import firebase from "firebase";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAZHhG0g285OCbqMiJEeJ_jPTtTPhCoToc",
  authDomain: "androidchat-27956.firebaseapp.com",
  projectId: "androidchat-27956",
  storageBucket: "androidchat-27956.appspot.com",
  messagingSenderId: "857757509466",
  appId: "1:857757509466:web:53102ecd5802c135db7563",
  databaseURL: "",
  trackingId: "",
  measurementId: "",
};

let app: firebase.app.App;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
export { db, auth, firebaseConfig };
