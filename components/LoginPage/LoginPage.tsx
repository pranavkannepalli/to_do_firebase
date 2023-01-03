import Head from "next/head";
import React from "react";
import { auth, db } from "../../firebase_setup";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import {useState} from "react";

type Props = {
  changeLast: (value: React.SetStateAction<number>) => void;
  changeUserExists: (value: React.SetStateAction<boolean>) => void;
  changeLoading: (value: React.SetStateAction<boolean>) => void
}

const LoginPage: React.FC<Props> = ({ changeLast, changeUserExists, changeLoading }) => {
  const [page, changePage] = useState<string>("signin");
  
  const signIn = async (email: string, password: string) => {
    changeLoading(true);
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      res.user && changeUserExists(true);
      db.ref(`${auth.currentUser?.uid}/`).once("value", snapshot => { changeLast(snapshot.val().LastId) })
    }
    catch (error) {
      console.log(error);
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
      console.log(error);
    }
    changeLoading(false);
  }

  if (page == "signin") {
    return (
      <SignIn changePage={changePage} signIn={signIn}></SignIn>
    )
  }
  else {
    return (
      <SignUp changePage={changePage} signUp={signUp}></SignUp>
    )
  }
}

export default LoginPage;