import React from "react";
import { useState } from "react";
import { auth, db } from "../../firebase_setup";
import { Icon } from "@iconify/react";

type Props = {
    groups: string[];
    signOut: () => void;
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
    allGroups: string[];
    changeAllGroups: (value: React.SetStateAction<string[]>) => void;
    changeGroups: (value: React.SetStateAction<string[]>) => void;
}

const Sidebar: React.FC<Props> = ({ groups, signOut, allGroups, changeAllGroups, changeGroups, changeCurrentGroup }) => {
    const [closed, changeClosed] = useState<boolean>(false);
    const [join, changeJoin] = useState<string>("");
    const [newGroup, setNewGroup] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newGroup) return;
        for (let i = 0; i < allGroups.length; i++) {
            if (newGroup == allGroups[i]) {
                setNewGroup('');
                alert("Group already exists")
                return;
            }
        }
        db.ref(`${newGroup}/`).update({ LastId: 2 })
        db.ref(`${newGroup}/Tasks/`).update({ 1: { id: 1, description: "Say Hello to Your New Group", isDone: false } });
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
        alert("Group created")
    }

    const inGroups = (group: string) => {
        for (let i = 0; i < groups.length; i++) {
            if (group == groups[i]) return true;
        }
        return false;
    }

    const inAllGroups = (group: string) => {
        for (let i = 0; i < allGroups.length; i++) {
            if (group == allGroups[i]) return true;
        }
        return false;
    }

    const joinGroup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!(inGroups(join)) && inAllGroups(join)) {
            db.ref(`${join}/Requests/${auth.currentUser?.uid}`).set({ id: auth.currentUser?.uid, email: auth.currentUser?.email })
            alert("Join request sent")
        }
        else {
            alert("Sorry, that group doesn't exist")
        }
        changeJoin("");
    }

    if (!closed) {
        return (
            <div className="col-lg-3 col-sm-12 bgdark expandedSiderbar px-4">
                <div className="primary">
                    <button className="p-2" onClick={() => changeClosed(!closed)}>
                        <svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.17188 33.7656H43.8281M1.17188 17.5156H43.8281M1.17188 1.26562H43.8281" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    {auth.currentUser?.email}
                </div>
                <h2 className="primary">
                    <a onClick={() => changeCurrentGroup("Personal")}>
                        Personal
                        <Icon className="sidebar-icon" icon="material-symbols:person-rounded" />
                    </a>
                </h2>
                <a className="light" onClick={() => changeCurrentGroup("Personal")}>
                    Todos <br />
                </a>
                <a className="light" onClick={() => console.log("nothing here")}>
                    Account <br />
                </a>
                <a className="light" onClick={() => signOut()}>
                    Sign Out <br />
                </a>
                <h2 className="primary">
                    Groups
                    <Icon className="sidebar-icon" icon="material-symbols:group-rounded" />
                </h2>
                {groups.map((group, index) => (
                    <a key={index} className="light" onClick={() => changeCurrentGroup(group)}>
                        {group != "Personal" ? <div>{group}<br /></div> : ""}
                    </a>
                ))}
                <div className="primary mt-3">Create a Group</div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" className="form-control" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} placeholder="Add new group" />
                        <button className="btn btn-outline-secondary" type="submit">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 17H13V13H17V11H13V7H11V11H7V13H11V17ZM5 21C4.45 21 3.979 20.8043 3.587 20.413C3.19567 20.021 3 19.55 3 19V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H19C19.55 3 20.021 3.19567 20.413 3.587C20.8043 3.979 21 4.45 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.021 20.8043 19.55 21 19 21H5ZM5 19H19V5H5V19ZM5 5V19V5Z" fill="white" />
                            </svg>
                        </button>
                    </div>
                </form>
                <div className="primary mt-3">Join a Group</div>
                <form onSubmit={joinGroup}>
                    <div className="input-group">
                        <input type="text" className="form-control" value={join} onChange={(e) => changeJoin(e.target.value)} placeholder="Join new group" />
                        <button className="btn btn-outline-secondary" type="submit">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.371 4.888 14.113C3.62933 12.8543 3 11.3167 3 9.5C3 7.68333 3.62933 6.14567 4.888 4.887C6.146 3.629 7.68333 3 9.5 3C11.3167 3 12.8543 3.629 14.113 4.887C15.371 6.14567 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5627 11.8127 14 10.75 14 9.5C14 8.25 13.5627 7.18733 12.688 6.312C11.8127 5.43733 10.75 5 9.5 5C8.25 5 7.18733 5.43733 6.312 6.312C5.43733 7.18733 5 8.25 5 9.5C5 10.75 5.43733 11.8127 6.312 12.688C7.18733 13.5627 8.25 14 9.5 14Z" fill="white" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        )
    }
    else {
        return (
            <div className="col-lg-1 col-sm-12 mb-2 px-2 button_only bgdark">
                <button className="p-2" onClick={() => changeClosed(!closed)}>
                    <svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.17188 33.7656H43.8281M1.17188 17.5156H43.8281M1.17188 1.26562H43.8281" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        )
    }

}

export default Sidebar;