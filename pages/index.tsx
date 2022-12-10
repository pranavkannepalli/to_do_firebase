import Head from 'next/head'
import  {db, auth}  from "../firebase_setup"
import React, {useState, useEffect} from "react";
import {ITodo} from "../types"
import {Button, Card} from "react-bootstrap";
import Todo from "../components/Todo";
import FormTodo from '../components/FormTodo';
import LoginPage from "../components/LoginPage";
import TodoPage from '../components/TodoPage';

export default function Home() {
  const [todos, updateTodos] = useState([]);
  const [userExists, changeUserExists] = useState<boolean>(false);
  const [loading, changeLoading] = useState<boolean>(false);
  const [lastId, changeLast] = useState<number>(0);
  useEffect(() => {loadData()}, [userExists])
  
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

  if (userExists) {
    return (
      <TodoPage todos={todos} lastId={lastId} changeLast={changeLast} changeLoading={changeLoading} changeUserExists={changeUserExists}></TodoPage>
    )
  }
  else if (loading) {
    <div>Loading...</div>
  } 
  else {
    return (
      <LoginPage changeLast={changeLast} changeLoading={changeLoading} changeUserExists={changeUserExists}></LoginPage>
    )
  }
}