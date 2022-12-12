import React from "react";
import { Form, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';
import {db, auth} from "../../firebase_setup";

type Props = {
    groups: string[];
    allGroups: string[];
    changeAllGroups: (value: React.SetStateAction<string[]>) => void;
    changeGroups: (value: React.SetStateAction<string[]>) => void;
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
}

const Groups: React.FC<Props> = ({ groups, allGroups, changeAllGroups, changeGroups, changeCurrentGroup }) => {
    const [newGroup, setNewGroup] = React.useState<string>('');
    const groupsNonsense = (group: string) => {
        changeCurrentGroup(group);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newGroup) return;
        for (let i = 0; i < allGroups.length; i++) {
            if (newGroup == allGroups[i]) {
                setNewGroup('');
                return;
            }
        }
        db.ref(`${newGroup}/`).update({ LastId: 2 })
        db.ref(`${newGroup}/Tasks/`).update({1: {id: 1, description: "Say Hello to Your New Group", isDone: false}});
        let Groups = groups;
        Groups.push(newGroup);
        changeGroups(Groups);
        db.ref(`${auth.currentUser?.uid}/Groups/`).set(Groups);
        changeCurrentGroup(newGroup);
        let all = allGroups;
        all.push(newGroup);
        changeAllGroups(Groups);
        db.ref("All Groups").set(all);
        setNewGroup("");
    }

    const joinGroup = (group: string) => {
        for (let i = 0; i < groups.length; i++) {
            if (group == groups[i]) {
                setNewGroup('');
                return;
            }
        }
        let Groups = groups;
        Groups.push(group);
        changeGroups(Groups);
        db.ref(`${auth.currentUser?.uid}/Groups/`).set(Groups);
        changeCurrentGroup(group);
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
            <DropdownButton className="my-3" id="dropdown-button-basic" title="Join a Group">
                {allGroups.map((group, index) => (
                    <Dropdown.Item onClick={() => joinGroup(group)} key={index}>{group}</Dropdown.Item>
                ))}
            </DropdownButton>
            <DropdownButton className="my-3" id="dropdown-button-basic" title="Groups">
                {groups.map((group, index) => (
                    <Dropdown.Item onClick={() => groupsNonsense(group)} key={index}>{group}</Dropdown.Item>
                ))}
            </DropdownButton>
        </div>
    )
}

export default Groups;