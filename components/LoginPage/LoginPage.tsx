import Head from "next/head";
import React from "react";
import { auth, db } from "../../firebase_setup";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

type Props = {
  changeLastId: (value: React.SetStateAction<number>) => void;
  changeUserExists: (value: React.SetStateAction<boolean>) => void;
  changeLoading: (value: React.SetStateAction<boolean>) => void
}

const LoginPage: React.FC<Props> = ({ changeLastId, changeUserExists, changeLoading }) => {
  
  const signIn = async (email: string, password: string) => {
    changeLoading(true);
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      res.user && changeUserExists(true);
      db.ref(`${auth.currentUser?.uid}/`).once("value", snapshot => { changeLastId(snapshot.val().LastId) })
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

  return (
    <div>
      <Head>
        <title>Login/Sign Up</title>
      </Head>
      <main>
        <div>
          <h1 className="text-center mb-4">Login/Sign Up</h1>
          <SignIn signIn={signIn}></SignIn>
          <SignUp signUp={signUp}></SignUp>
        </div>
      </main>
    </div>
  )
}

export default LoginPage;