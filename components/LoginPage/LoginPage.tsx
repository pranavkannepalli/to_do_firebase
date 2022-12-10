import Head from "next/head";
import React from "react";
import { auth, db } from "../../firebase_setup";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

type Props = {
  changeLast: (value: React.SetStateAction<number>) => void;
  changeUserExists: (value: React.SetStateAction<boolean>) => void;
  changeLoading: (value: React.SetStateAction<boolean>) => void
}

const LoginPage: React.FC<Props> = ({ changeLast, changeUserExists, changeLoading }) => {

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