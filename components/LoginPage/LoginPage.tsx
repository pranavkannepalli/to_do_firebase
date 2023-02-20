import Head from "next/head";
import React from "react";
import { auth, db } from "../../firebase_setup";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ResetPassword from "./ResetPassword";
import {useState} from "react";
import { signInWithGoogle } from "../../firebase_setup";


type Props = {
  changeLast: (value: React.SetStateAction<number>) => void;
  changeUserExists: (value: React.SetStateAction<boolean>) => void;
  changeLoading: (value: React.SetStateAction<boolean>) => void
}

const LoginPage: React.FC<Props> = ({ changeLast, changeUserExists, changeLoading }) => {
  const [page, changePage] = useState<string>("signin");
  
  async function google() {
    changeLoading(true);
    await signInWithGoogle().then((user) => {
        changeLoading(false)
        changeUserExists(true)
    }).catch((error) => alert(error));
}

  const signIn = async (email: string, password: string) => {
    changeLoading(true);
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      res.user && changeUserExists(true);
      db.ref(`${auth.currentUser?.uid}/`).once("value", snapshot => { changeLast(snapshot.val().LastId) })
    }
    catch (error) {
      if (error == "FirebaseError: Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).") {
        alert('The password is invalid.')
      }
      else if (error == "FirebaseError: Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)."){
        alert("No user exists with that email.")
      }
      else alert(error);
    }
    changeLoading(false);
  }

  const signUp = async (email: string, password: string) => {
    changeLoading(true);
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      db.ref(`${auth.currentUser?.uid}/`).update({ LastId: 2 })
      db.ref(`${auth.currentUser?.uid}/Tasks/`).update({1: {id: 1, description: "Say Hello to Your New Account, Check to mark as Done, X to Remove", isDone: false, addedBy: "Admin"}})
      db.ref(`${auth.currentUser?.uid}/`).update({ Groups: ["Personal"] })
      res.user && changeUserExists(true);
    }
    catch (error) {
      if (error == "FirebaseError: Firebase: The email address is already in use by another account. (auth/email-already-in-use).") {
        alert("This email is already in use.")
      }
      else if (error == "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).") {
        alert("Password must be at least 6 characters.")
      }
      else {
        alert(error);
      }
    }
    changeLoading(false);
  }

  if (page == "signin") {
    return (
      <SignIn changeLoading={changeLoading} changePage={changePage} signIn={signIn} google={google}/>
    )
  }
  else if (page == "signup") {
    return (
      <SignUp changePage={changePage} signUp={signUp} changeLoading={changeLoading} google={google}/>
    )
  }
  else {
    return (
      <ResetPassword changePage={changePage}/>
    )
  }
}

export default LoginPage;