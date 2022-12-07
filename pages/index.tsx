import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import  {db}  from "../firebase_setup"
import React, {useState, useEffect} from "react";
import {ITodo} from "../types"
import {Button, Card} from "react-bootstrap";
import Todo from "../components/Todo";
import FormTodo from '../components/FormTodo';

export default function Home() {
  const [todos, updateTodos] = useState([]);
  
  useEffect(() => {loadData()}, [])
  
  const loadData = () => {
    db.ref("Tasks/").on("value", snapshot => {
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
    db.ref("LastId").on("value", snapshot => {lastId = snapshot.val()})
    db.ref(`Tasks/${lastId+1}/`).set({id: lastId+1, description: text, isDone: false})
    db.ref().update({LastId: lastId+1})
  };
  const markTodo = (id: number) => {
    db.ref(`Tasks/${id}/`).update({isDone:true});
  };
  const removeTodo = (id: number) => {
    db.ref(`Tasks/${id}/`).remove();
  };

  return (
    <div>
      <Head>
        <title>To-do App</title>
      </Head>
      <main>
        <div>
        <h1 className="text-center mb-4">Todo List</h1>
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
