import Head from "next/head";
import React from "react";
import { auth, db } from "../../firebase_setup";
import FormTodo from "./FormTodo";
import Todo from "./Todo";
import { GroupRequest, ITodo } from "../../types"
import { Button, Card } from "react-bootstrap";
import Groups from "./Groups"

type Props = {
    currentGroup: string;
    groups: string[];
    groupRequests: GroupRequest[];
    todos: ITodo[];
    lastId: number;
    allGroups: string[];
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
    changeGroups: (value: React.SetStateAction<string[]>) => void;
    changeAllGroups: (value: React.SetStateAction<string[]>) => void;
    changeLast: (value: React.SetStateAction<number>) => void;
    changeUserExists: (value: React.SetStateAction<boolean>) => void;
    changeLoading: (value: React.SetStateAction<boolean>) => void
}

const TodoPage: React.FC<Props> = ({ currentGroup, groups, groupRequests, allGroups, todos, lastId, changeCurrentGroup, changeGroups, changeAllGroups, changeLast, changeUserExists, changeLoading }) => {

    const addTodo = (text: string) => {
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/${lastId + 1}/`).set({ id: lastId + 1, description: text, isDone: false, addedBy: auth.currentUser?.email })
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/`).update({ LastId: lastId + 1 })
        changeLast(lastId + 1)
    };
    const markTodo = (id: number) => {
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/${id}/`).update({ isDone: true });
    };
    const removeTodo = (id: number) => {
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/${id}/`).remove();
    };

    const signOut = async () => {
        changeLoading(true);
        try {
            const res = await auth.signOut();
            changeUserExists(false);
            changeCurrentGroup("Personal");
            changeGroups(["Personal"])
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
                    <h1 className="text-center">Todo List</h1>
                    <h3 className="text-center">User: <span>{auth.currentUser?.email}</span><Button className="mx-2" onClick={signOut}>Sign Out</Button></h3>
                    <br />
                    <Groups currentGroup={currentGroup} groups={groups} allGroups={allGroups} groupRequests={groupRequests} changeAllGroups={changeAllGroups} changeGroups={changeGroups} changeCurrentGroup={changeCurrentGroup} />
                    <FormTodo addTodo={addTodo} />
                    {todos.map((todo, index) => (
                        <Card className="bg-dark" key={index}>
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