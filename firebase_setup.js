import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBBoP5nb1cbHCENcOsV9mYNEyCPg4Ed6Kw",
    authDomain: "todo-list-aa205.firebaseapp.com",
    databaseURL: "https://todo-list-aa205-default-rtdb.firebaseio.com",
    projectId: "todo-list-aa205",
    storageBucket: "todo-list-aa205.appspot.com",
    messagingSenderId: "210858993508",
    appId: "1:210858993508:web:8cd175132dd27f3941fc71",
    measurementId: "G-SEB45ZG4FF"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.database();
export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider)