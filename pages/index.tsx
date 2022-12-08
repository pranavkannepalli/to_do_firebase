import Head from 'next/head'
import  {db, auth}  from "../firebase_setup"
import React, {useState, useEffect} from "react";
import {ITodo} from "../types"
import {Button, Card} from "react-bootstrap";
import Todo from "../components/Todo";
import FormTodo from '../components/FormTodo';
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

export default function Home() {
  const [todos, updateTodos] = useState([]);
  const [userExists, changeUserExists] = useState<boolean>(false);
  const [loading, changeLoading] = useState<boolean>(false);
  useEffect(() => {loadData()}, [])
  
  const loadData = () => {
    db.ref(`${auth.currentUser?.uid}/Tasks/`).on("value", snapshot => {
    let allTodos:any = [];
    snapshot.forEach(snap => {
      var data : any = snap.val()
      var newTodo : ITodo = {
        id: data.id,
        description: data.description,
        isDone : data.isDone
      }
      allTodos.push(newTodo)
    })
    updateTodos(allTodos);
  })};

  const addTodo = (text: string) => {
    var lastId = 0;
    db.ref(`${auth.currentUser?.uid}/LastId`).on("value", snapshot => {lastId = snapshot.val()})
    db.ref(`${auth.currentUser?.uid}/Tasks/${lastId+1}/`).set({id: lastId+1, description: text, isDone: false})
    db.ref(`${auth.currentUser?.uid}/`).update({LastId: lastId+1})
  };
  const markTodo = (id: number) => {
    db.ref(`${auth.currentUser?.uid}/Tasks/${id}/`).update({isDone:true});
  };
  const removeTodo = (id: number) => {
    db.ref(`${auth.currentUser?.uid}/Tasks/${id}/`).remove();
  };

  const signIn = async (email: string, password: string) => {
    changeLoading(true);
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      res.user && changeUserExists(true);
    } 
    catch(error) {
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
    catch(error) {
      console.log(error);
    }
    changeLoading(false);
  }

  const signOut = async () => {
    changeLoading(true);
    try {
      const res = await auth.signOut();
      changeUserExists(false);
    }
    catch (error) {
      console.log(error);
    }
    changeLoading(false);
  }

  console.log(auth.currentUser);
  if (userExists) {
    return (
      <div>
        <Head>
          <title>To-do App</title>
        </Head>
        <main>
          <div>
          <h1 className="text-center mb-4">Todo List - {auth.currentUser?.email}</h1>
          <Button onClick={signOut}>Sign Out</Button>
            <FormTodo addTodo={addTodo}/>
            {todos.map((todo, index) => (
              <Card key={index}>
                <Card.Body>
                  <Todo todo={todo} markTodo={markTodo} removeTodo={removeTodo} />
                </Card.Body>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }
  else if (loading) {
    <div>Loading...</div>
  } 
  else {
    return (
      <div>
        <Head>
          <title>Login/Sign Up</title>
        </Head>
        <main>
          <div>
            <h1 className="text-center mb-4">Login</h1>
            <SignIn signIn={signIn}></SignIn>
            <SignUp signUp={signUp}></SignUp>
          </div>
        </main>
      </div>
    )
  }
}
