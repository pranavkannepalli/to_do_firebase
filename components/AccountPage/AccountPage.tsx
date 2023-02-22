import Head from "next/head";
import React, { useState } from "react";
import { auth } from "../../firebase_setup";
import firebase from "firebase/compat/app"
import Sidebar from "../TodoPage/Sidebar";
import { Button, Form } from "react-bootstrap";

type Props = {
    groups: string[];
    allGroups: string[];
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
    changeGroups: (value: React.SetStateAction<string[]>) => void;
    changeAllGroups: (value: React.SetStateAction<string[]>) => void;
    changeUserExists: (value: React.SetStateAction<boolean>) => void;
    changeLoading: (value: React.SetStateAction<boolean>) => void
}

const AccountPage: React.FC<Props> = ({ groups, allGroups, changeCurrentGroup, changeGroups, changeAllGroups, changeUserExists, changeLoading }) => {

    const [currentP, changeCurrentP] = useState("");
    const [newP, changeNewP] = useState("");
    const [repeatNewP, changeRepeatNewP] = useState("");
    const [newE, changeNewE] = useState("");

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

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        changeLoading(true);
        var user = auth.currentUser;
        if (user == null || user.email == null) {
            alert("Something's fishy")
            return;
        }
        
        if (newE == "" && newP == "") {
            alert("Please enter a new email or password");
            return;
        }

        if (newE != "") {
            var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentP)
            user.reauthenticateWithCredential(cred).then(() => {
                var user = firebase.auth().currentUser;
                user?.updateEmail(newE).then(() => {
                alert("Email updated!")
                }).catch((error) => alert(error))
            }).catch((error) => {
                if (error == "FirebaseError: Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).") {
                    alert("Wrong current password or user does not have a password.");
                    return;
                }
                else {
                    alert(error)
                    return;
                }
            })
        }

        if (newP != "" && newP == repeatNewP) {
            var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentP)
            user.reauthenticateWithCredential(cred).then(() => {
                var user = firebase.auth().currentUser;
                user?.updatePassword(newP).then(() => {
                alert("Password updated!")
                }).catch((error) => {
                    if(error == "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).") {
                        alert("Choose a stronger password");
                        return;
                    }
                    else {
                        alert(error);
                        return;
                    }
                })
            }).catch((error) => {
                if (error == "FirebaseError: Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).") {
                    alert("Wrong current password or user does not have a password.");
                    return;
                }
                else {
                    alert(error)
                    return;
                }
            })
        }
        else if (newP != repeatNewP) {
            alert("Passwords do not match");
            return;
        }
        changeLoading(false);
        changeCurrentP("");
        changeNewE("");
        changeRepeatNewP("");
        changeNewP("");
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
                        <div className="col-lg-9 col-sm-12 px-4">
                            <h1 className="primary">
                                Account
                            </h1>
                            <h2 className="secondary">
                                Current Account Info
                            </h2>
                            <h2 className="secondary">
                                Change email or password
                            </h2>
                            <Form onSubmit={(e) => handleSubmit(e)}>
                                <Form.Group className="my-2">
                                    <Form.Label>
                                        Enter your current passsword
                                    </Form.Label>
                                    <Form.Control
                                        required={true}
                                        type="password"
                                        className="input"
                                        value={currentP}
                                        onChange={(e) => changeCurrentP(e.target.value)}
                                        placeholder="Enter current password" />
                                </Form.Group>
                                <Form.Group className="my-2">
                                    <Form.Label>
                                        Enter the email you wish to change to
                                    </Form.Label>
                                    <Form.Control
                                        required={false}
                                        type="email"
                                        className="input"
                                        value={newE}
                                        onChange={(e) => changeNewE(e.target.value)}
                                        placeholder="Enter new email if you want to change it" />
                                </Form.Group>
                                <Form.Group className="my-2">
                                    <Form.Label>
                                        Enter the password you wish to change to
                                    </Form.Label>
                                    <Form.Control
                                        required={true}
                                        type="password"
                                        className="input"
                                        value={newP}
                                        onChange={(e) => changeNewP(e.target.value)}
                                        placeholder="Enter new password if you want to change it" />
                                    <Form.Control
                                        required={true}
                                        type="password"
                                        className="input"
                                        value={repeatNewP}
                                        onChange={(e) => changeRepeatNewP(e.target.value)}
                                        placeholder="Repeat new password if you want to change it" />
                                </Form.Group>
                                <Button className="button bgprimary my-3" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AccountPage;