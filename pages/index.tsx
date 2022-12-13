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
  const [allGroups, changeAllGroups] = useState<string[]>([]);
  const [groups, changeGroups] = useState<string[]>(["Personal"]);
  const [currentGroup, changeCurrentGroup] = useState<string>("Personal");
  useEffect(() => { loadData() }, [userExists, currentGroup])

  const loadData = () => {
    db.ref("All Groups").once("value", snapshot => {
      changeAllGroups(snapshot.val());
    })
    if (userExists) {
      db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/`).once("value", snapshot => { changeLast(snapshot.val().LastId) })
      db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/`).on("value", snapshot => {
        let allTodos: any = [];
        snapshot.forEach(snap => {
          var data: any = snap.val()
          var newTodo: ITodo = {
            id: data.id,
            description: data.description,
            isDone: data.isDone,
            addedBy: data.addedBy
          }
          allTodos.push(newTodo)
        })
        updateTodos(allTodos);
      })
      try {
        db.ref(`${auth.currentUser?.uid}/Groups/`).once("value", snapshot => {
          let Groups: any = [];
          for (let i = 0; i < snapshot.val().length; i++) {
            Groups.push(snapshot.val()[i]);
          }
          changeGroups(Groups);
        })
      }
      catch (error) {
        console.log(error);
      }
    }
  };

  if (userExists) {
    return (
      <TodoPage currentGroup={currentGroup} groups={groups} allGroups={allGroups} todos={todos} lastId={lastId} changeAllGroups={changeAllGroups} changeCurrentGroup={changeCurrentGroup} changeGroups={changeGroups} changeLast={changeLast} changeLoading={changeLoading} changeUserExists={changeUserExists} />
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