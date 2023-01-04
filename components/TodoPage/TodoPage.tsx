import Head from "next/head";
import React from "react";
import { auth, db } from "../../firebase_setup";
import FormTodo from "./FormTodo";
import Todo from "./Todo";
import { GroupRequest, ITodo } from "../../types"
import { Button, Card } from "react-bootstrap";
import Sidebar from "./Sidebar"
import Request from "./Request"

type Props = {
    currentGroup: string;
    groups: string[];
    groupRequests: GroupRequest[];
    todos: ITodo[];
    lastId: number;
    allGroups: string[];
    changeGroupRequests: (value: React.SetStateAction<GroupRequest[]>) => void;
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
    changeGroups: (value: React.SetStateAction<string[]>) => void;
    changeAllGroups: (value: React.SetStateAction<string[]>) => void;
    changeLast: (value: React.SetStateAction<number>) => void;
    changeUserExists: (value: React.SetStateAction<boolean>) => void;
    changeLoading: (value: React.SetStateAction<boolean>) => void
}

const TodoPage: React.FC<Props> = ({ currentGroup, groups, groupRequests, allGroups, todos, lastId, changeGroupRequests, changeCurrentGroup, changeGroups, changeAllGroups, changeLast, changeUserExists, changeLoading }) => {

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

    const acceptRequest = (request: GroupRequest) => {
        db.ref(`${request.id}/Groups/`).once("value", snapshot => {
            let Groups: any = [];
            let ingroup: boolean = false;
            for (let i = 0; i < snapshot.val().length; i++) {
                Groups.push(snapshot.val()[i]);
                if (snapshot.val()[i] == currentGroup) {
                    ingroup = true;
                }
            }
            Groups.push(currentGroup)
            if (!ingroup) {
                db.ref(`${request.id}/Groups/`).update(Groups);
            }
        });
        deleteRequest(request);
    }

    const deleteRequest = (request: GroupRequest) => {
        db.ref(`${currentGroup}/Requests/${request.id}/`).remove();
        db.ref(`${currentGroup}/Requests/`).once("value", snapshot => {
            let allRequests: any = [];
            snapshot.forEach(snap => {
                var data: any = snap.val();
                var newRequest: GroupRequest = {
                    id: data.id,
                    email: data.email
                }
                allRequests.push(newRequest);
            })
            changeGroupRequests(allRequests);
        })
    }

    return (
        <div>
            <Head>
                <title>To-do App</title>
            </Head>
            <main>
                <div className="grid">
                    <div className="row">
                        <Sidebar groups={groups} allGroups={allGroups} signOut={signOut} changeAllGroups={changeAllGroups} changeGroups={changeGroups} changeCurrentGroup={changeCurrentGroup}></Sidebar>
                        <div className="col-lg-8 col-sm-10 px-4">
                            <h1 className="primary">
                                {currentGroup}
                            </h1>
                            <h2 className="secondary">
                                Join Requests
                            </h2>
                            {groupRequests.map((request, index) => (
                                <Card className="bgdark-alt border-0 my-2" key={index}>
                                    <Card.Body>
                                        <Request key={index} acceptRequest={acceptRequest} deleteRequest={deleteRequest} request={request} />
                                    </Card.Body>
                                </Card>))}
                            <h2 className="secondary">
                                Add a Todo
                            </h2>
                            <FormTodo addTodo={addTodo} />
                            <h2 className="secondary">
                                Todos
                            </h2>
                            {todos.map((todo, index) => (
                                <Card className="bgdark-alt border-0 my-2" key={index}>
                                    <Card.Body>
                                        <Todo todo={todo} markTodo={markTodo} removeTodo={removeTodo} />
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TodoPage;