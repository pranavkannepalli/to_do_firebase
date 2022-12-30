import React from "react";
import { Form, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';
import {db, auth} from "../../firebase_setup";
import { GroupRequest } from "../../types";
import Request from "./Request";

type Props = {
    groups: string[];
    allGroups: string[];
    groupRequests: GroupRequest[];
    changeAllGroups: (value: React.SetStateAction<string[]>) => void;
    changeGroups: (value: React.SetStateAction<string[]>) => void;
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
}

const Groups: React.FC<Props> = ({ groups, allGroups, groupRequests, changeAllGroups, changeGroups, changeCurrentGroup }) => {
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
        if (!(inGroups(group))) {
            db.ref(`${group}/Requests/${auth.currentUser?.uid}`).set({id: auth.currentUser?.uid, email: auth.currentUser?.email})
        }
    }

    const acceptRequest = (request : GroupRequest) => {
        console.log(request)
    }

    const declineRequest = (request : GroupRequest) => {
        console.log(request)
    }

    const inGroups = (group : string) => {
        for(let i = 0; i < groups.length; i++) {
            if (group == groups[i]) return true;
        }
        return false;
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
                    <Dropdown.Item onClick={() => joinGroup(group)} key={index}>{(inGroups(group)) ? "Already Joined" : group}</Dropdown.Item>
                ))}
            </DropdownButton>
            <DropdownButton className="my-3" id="dropdown-button-basic" title="Groups">
                {groups.map((group, index) => (
                    <Dropdown.Item onClick={() => groupsNonsense(group)} key={index}>{group}</Dropdown.Item>
                ))}
            </DropdownButton>
            {groupRequests.map((request, index) => (
                <Request key={index} acceptRequest={acceptRequest} declineRequest={declineRequest} request={request}/>
            ))}
        </div>
    )
}

export default Groups;