import { db, auth } from "../firebase_setup"
import React, { useState, useEffect } from "react";
import { ITodo, GroupRequest } from "../types"
import LoginPage from "../components/LoginPage/LoginPage";
import TodoPage from '../components/TodoPage/TodoPage';
import AccountPage from "../components/AccountPage/AccountPage";

export default function Home() {
  const [todos, changeTodos] = useState<ITodo[]>([]);
  const [sortedTodos, changeSorted] = useState<ITodo[]>([]);
  const [tags, changeTags] = useState<string[]>([]);
  const [userExists, changeUserExists] = useState<boolean>(false);
  const [loading, changeLoading] = useState<boolean>(false);
  const [lastId, changeLast] = useState<number>(0);
  const [allGroups, changeAllGroups] = useState<string[]>([]);
  const [groups, changeGroups] = useState<string[]>(["Personal"]);
  const [currentGroup, changeCurrentGroup] = useState<string>("Personal");
  const [groupRequests, changeGroupRequests] = useState<GroupRequest[]>([]);

  useEffect(() => { loadData() }, [userExists, currentGroup])
  useEffect(() => changeUserExists(auth.currentUser != null), [auth.currentUser])
  const loadData = () => {
    db.ref("All Groups").once("value", snapshot => {
      changeAllGroups(snapshot.val());
    })
    if (auth.currentUser != null && currentGroup != "Account") {
      db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/`).once("value", snapshot => { changeLast(snapshot.val().LastId) })
      if(lastId == null || lastId == undefined) {
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/`).update({LastId: 2})
        changeLast(3)
      }
      db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/`).on("value", snapshot => {
        let allTodos: any = [];
        snapshot.forEach(snap => {
          var data: any = snap.val();
          if ("date" in data) {
            var newTodo: ITodo = {
              id: data.id,
              description: data.description,
              isDone: data.isDone,
              addedBy: data.addedBy,
              date: new Date(data.date),
              subtasks: undefined,
              tag: "Untagged"
            }
          }
          else {
            var newTodo: ITodo = {
              id: data.id,
              description: data.description,
              isDone: data.isDone,
              addedBy: data.addedBy,
              date: null,
              subtasks: undefined,
              tag: "Untagged"
            }
          }

          if ("tag" in data) {
            newTodo.tag = data.tag
          }
          else {
            db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/${data.id}`).update({tag: "Untagged"})
          }

          db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/${data.id}/Subtasks`).once("value", s => {
            if(s.exists()) {
              var allSubtasks: any = [];
              s.forEach(s2 => {
                var d: any = s2.val();
                if ("date" in d) {
                  var newSubtask: ITodo = {
                    id: d.id,
                    description: d.description,
                    isDone: d.isDone,
                    addedBy: d.addedBy,
                    date: new Date(d.date),
                    subtasks: [],
                    tag: "Untagged"
                  }
                }
                else {
                  var newSubtask: ITodo = {
                    id: d.id,
                    description: d.description,
                    isDone: d.isDone,
                    addedBy: d.addedBy,
                    date: null,
                    subtasks: undefined,
                    tag: "Untagged"
                  }
                } 

                allSubtasks.push(newSubtask);
              })
              newTodo.subtasks = allSubtasks
            }
          })

          allTodos.push(newTodo);
        })
        changeTodos(allTodos);
        changeSorted(allTodos);
      })

      try {
        if (currentGroup != "Personal") {
          db.ref(`${currentGroup}/Requests/`).once("value", snapshot => {
            let allRequests: any = [];
            snapshot.forEach(snap => {
              var data: any = snap.val();
              var newRequest: GroupRequest = {
                id: data.id,
                username: data.username
              }
              allRequests.push(newRequest);
            })
            changeGroupRequests(allRequests);
          })
        }
        else {
          changeGroupRequests([])
        }
      }
      catch (error) {
        changeGroupRequests([])
        console.log(error)
      }

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
        db.ref(`${auth.currentUser?.uid}/Groups/`).update({0: "Personal"})
        console.log(error);
      }

      try {
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tags/`).once("value", snapshot => {
          let Tags: any = [];
          for (let i = 0; i < snapshot.val().length; i++) {
            Tags.push(snapshot.val()[i]);
          }
          changeTags(Tags);
        })
      }
      catch (error) {
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tags/`).update({0: "Personal"})
        console.log(error);
      }
    }
  };

  if (auth.currentUser != null) {
    if(currentGroup != "Account") {
      return (
        <TodoPage currentGroup={currentGroup}
          groups={groups} allGroups={allGroups} groupRequests={groupRequests}
          todos={todos} lastId={lastId} changeAllGroups={changeAllGroups}
          changeCurrentGroup={changeCurrentGroup} changeGroups={changeGroups}
          changeLast={changeLast} changeLoading={changeLoading}
          changeUserExists={changeUserExists} changeGroupRequests={changeGroupRequests}
          sortedTodos={sortedTodos} changeSorted={changeSorted}
          tags={tags} changeTags={changeTags}/>
      )
    }
    else {
      return (
        <AccountPage lastId={lastId} groups={groups} allGroups={allGroups} changeUserExists={changeUserExists} changeAllGroups={changeAllGroups} changeCurrentGroup={changeCurrentGroup} changeGroups={changeGroups} changeLoading={changeLoading}/>
      )
    }
  }
  else if (loading) {
    <div>Loading...</div>
  }
  else {
    return (
      <LoginPage changeLast={changeLast} changeLoading={changeLoading}
        changeUserExists={changeUserExists} />
    )
  }
}