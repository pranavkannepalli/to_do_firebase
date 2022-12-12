import Head from "next/head";
import React from "react";
import { auth, db } from "../../firebase_setup";
import FormTodo from "./FormTodo";
import Todo from "./Todo";
import { Button, Card } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';
import DropdownItem from "react-bootstrap/esm/DropdownItem";

type Props = {
    currentGroup: string;
    groups: string[];
    todos: never[];
    lastId: number;
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
    changeGroups: (value: React.SetStateAction<string[]>) => void;
    changeLast: (value: React.SetStateAction<number>) => void;
    changeUserExists: (value: React.SetStateAction<boolean>) => void;
    changeLoading: (value: React.SetStateAction<boolean>) => void
}

const TodoPage: React.FC<Props> = ({ currentGroup, groups, todos, lastId, changeCurrentGroup, changeGroups, changeLast, changeUserExists, changeLoading }) => {

    const addTodo = (text: string) => {
        db.ref(`${currentGroup == "Personal" ? auth.currentUser?.uid : currentGroup}/Tasks/${lastId + 1}/`).set({ id: lastId + 1, description: text, isDone: false })
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
        }
        catch (error) {
            console.log(error);
        }
        changeLoading(false);
    }

    const groupsNonsense = (group:string) => {
        changeCurrentGroup(group);
    }

    return (
        <div>
            <Head>
                <title>To-do App</title>
            </Head>
            <main>
                <div>
                    <h1 className="text-center">Todo List</h1>
                    <h3 className="text-center">User: <span>{auth.currentUser?.email}</span></h3>
                    <Button onClick={signOut}>Sign Out</Button>
                    <br />
                    <DropdownButton id="dropdown-button-basic" title="Groups">
                        {groups.map((group, index) => (
                            <Dropdown.Item onClick={() => groupsNonsense(group)} key={index}>{group}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <FormTodo addTodo={addTodo} />
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