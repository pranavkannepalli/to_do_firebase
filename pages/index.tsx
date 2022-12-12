import { db, auth } from "../firebase_setup"
import React, { useState, useEffect } from "react";
import { ITodo } from "../types"
import LoginPage from "../components/LoginPage/LoginPage";
import TodoPage from '../components/TodoPage/TodoPage';

// figure out a way to change the current group
// figure out a way to add groups
// figure out a way to add people to groups
export default function Home() {
  const [todos, updateTodos] = useState([]);
  const [userExists, changeUserExists] = useState<boolean>(false);
  const [loading, changeLoading] = useState<boolean>(false);
  const [lastId, changeLast] = useState<number>(0);
  const [groups, changeGroups] = useState(["Personal"]);
  const [currentGroup, changeCurrentGroup] = useState<string>("Personal");
  useEffect(() => { loadData() }, [userExists, currentGroup])

  const loadData = () => {
    if (userExists) {
      
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/`).on("value", snapshot => {
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
      try {
        db.ref(`${auth.currentUser?.uid}/Groups/`).once("value", snapshot => {
          let allGroups: any = [];
          for (let i = 0; i < snapshot.val().length; i++) {
            allGroups.push(snapshot.val()[i]);
          }
          changeGroups(allGroups);
        })
      }
      catch (error) {
        console.log(error);
      }
    }
  };

  if (userExists) {
    return (
      <TodoPage currentGroup={currentGroup} groups={groups} todos={todos} lastId={lastId} changeCurrentGroup={changeCurrentGroup} changeGroups={changeGroups} changeLast={changeLast} changeLoading={changeLoading} changeUserExists={changeUserExists} />
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