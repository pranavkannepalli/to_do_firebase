import React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';
import {db, auth} from "../../firebase_setup";

type Props = {
    groups: string[];
    changeGroups: (value: React.SetStateAction<string[]>) => void;
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
}

const groupPage: React.FC<Props> = ({ groups, changeGroups, changeCurrentGroup }) => {
    const [newGroup, setNewGroup] = useState<string>("");
    const groupsNonsense = (group: string) => {
        changeCurrentGroup(group);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newGroup) return;
        setNewGroup("");
        db.ref(`${newGroup}/`).update({ LastId: 2 })
        db.ref(`${newGroup}/Tasks/`).update({1: {id: 1, description: "Say Hello to Your New Group", isDone: false}});
        let allGroups = groups;
        allGroups.push(newGroup);
        changeGroups(allGroups);
        db.ref(`${auth.currentUser?.uid}/Groups/`).update(allGroups);
        console.log(groups);
        changeCurrentGroup(newGroup);
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>
                        <b>Add Group</b>
                    </Form.Label>
                    <Form.Control type="text" className="input" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} placeholder="Add new group" />
                </Form.Group>
                <Button className="secondary my-3" type="submit">
                    Submit
                </Button>
            </Form>
            <DropdownButton className="my-3" id="dropdown-button-basic" title="Groups">
                {groups.map((group, index) => (
                    <Dropdown.Item onClick={() => groupsNonsense(group)} key={index}>{group}</Dropdown.Item>
                ))}
            </DropdownButton>
        </div>
    )
}

export default groupPage;