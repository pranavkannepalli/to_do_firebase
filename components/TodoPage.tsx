import Head from "next/head";
import React from "react";
import {auth, db} from "../firebase_setup";
import FormTodo from "./FormTodo";
import Todo from "./Todo";
import  {Button, Card} from "react-bootstrap";

type Props = {
    todos: never[];
    lastId : number;
    changeLast : (value: React.SetStateAction<number>) => void;
    changeUserExists : (value: React.SetStateAction<boolean>) => void;
    changeLoading : (value: React.SetStateAction<boolean>) => void
}

const TodoPage : React.FC<Props> = ({todos, lastId, changeLast, changeUserExists, changeLoading}) => {

    const addTodo = (text: string) => {
    db.ref(`${auth.currentUser?.uid}/Tasks/${lastId+1}/`).set({id: lastId+1, description: text, isDone: false})
    db.ref(`${auth.currentUser?.uid}/`).update({LastId: lastId+1})
    changeLast(lastId+1)
  };
  const markTodo = (id: number) => {
    db.ref(`${auth.currentUser?.uid}/Tasks/${id}/`).update({isDone:true});
  };
  const removeTodo = (id: number) => {
    db.ref(`${auth.currentUser?.uid}/Tasks/${id}/`).remove();
  };

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

export default TodoPage;