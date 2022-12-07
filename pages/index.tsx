import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import  {db}  from "../firebase_setup"
import React, {useState, useEffect} from "react";
import {ITodo} from "../types"
import {Button, Card} from "react-bootstrap";

export default function Home() {
  const [todos, updateTodos] = useState([]);
  
  useEffect(() => {loadData()}, [])
  
  const loadData = () => {
    db.ref("Tasks/").on("value", snapshot => {
    let allTodos:any = [];
    snapshot.forEach(snap => {
      allTodos.push(snap.val)
    })
    updateTodos(allTodos);
    console.log(todos);
  })};

  const addTodo = (text: string) => {};
  const markTodo = (id: number) => {};
  const removeTodo = (id: number) => {};

  return (
    <div>
      <Head>
        <title>To-do App</title>
      </Head>
      <main>
        <div>
          HELLO WORLD
        </div>
        <Button onClick={loadData}>load Data</Button>
      </main>
    </div>
  )
}
