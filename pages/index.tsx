import { db, auth } from "../firebase_setup"
import React, { useState, useEffect } from "react";
import { ITodo } from "../types"
import LoginPage from "../components/LoginPage/LoginPage";
import TodoPage from '../components/TodoPage/TodoPage';

export default function Home() {
  const [todos, updateTodos] = useState([]);
  const [userExists, changeUserExists] = useState<boolean>(false);
  const [loading, changeLoading] = useState<boolean>(false);
  const [lastId, changeLast] = useState<number>(0);
  useEffect(() => { loadData() }, [userExists])

  const loadData = () => {
    db.ref(`${auth.currentUser?.uid}/Tasks/`).on("value", snapshot => {
      let allTodos: any = [];
      snapshot.forEach(snap => {
        var data: any = snap.val()
        var newTodo: ITodo = {
          id: data.id,
          description: data.description,
          isDone: data.isDone
        }
        allTodos.push(newTodo)
      })
      updateTodos(allTodos);
    })
  };

  if (userExists) {
    return (
      <TodoPage todos={todos} lastId={lastId} changeLast={changeLast} changeLoading={changeLoading} changeUserExists={changeUserExists} />
    )
  }
  else if (loading) {
    <div>Loading...</div>
  }
  else {
    return (
      <LoginPage changeLast={changeLast} changeLoading={changeLoading} changeUserExists={changeUserExists} />
    )
  }
}