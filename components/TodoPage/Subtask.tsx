import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import { ITodo } from "../../types";
import { Icon } from '@iconify/react';
import { useState, useRef } from "react";

type Props = {
    parentId: number;
    todo: ITodo;
    markSubtask: (parentId: number, id: number, done: boolean) => void;
    removeSubtask: (parentId: number, id: number) => void;
    editSubtask: (parentId: number, todo: ITodo) => void;
}

const Subtask: React.FC<Props> = ({ parentId, todo, markSubtask, removeSubtask, editSubtask }) => {
    const [editing, changeEditing] = useState<boolean>(false);
    const [deleting, changeDeleting] = useState<boolean>(false);
    const [value, changeValue] = useState<string>(todo.description);
    const [due, changeDue] = useState<Date>();

    const getDate = () => {
        if (todo.date == null || todo.date == undefined) return "";
        var date: string = todo.date.toLocaleDateString();
        var s: string[] = date.split("/");
        while (s[0].length < 2) {
            s[0] = "0".concat(s[0]);
        }
        while (s[1].length < 2) {
            s[1] = "0".concat(s[1]);
        }
        while (s[2].length < 4) {
            s[2] = "0".concat(s[2]);
        }
        date = s[2].concat("-", s[0], "-", s[1])
        return date;
    }

    const getTime = () => {
        if (todo.date == null || todo.date == undefined) return "";
        //"12:27:00 PM" -> "HH:mm:ss"
        var time: string = todo.date.toLocaleTimeString();
        var AMPM = time.substring(time.length - 2);
        var s: string[] = time.substring(0, time.length - 3).split(":")

        if (AMPM == "PM") {
            if (s[0] != "12") {
                s[0] = String(parseInt(s[0]) + 12);
            }
        }
        else {
            if (s[0] == "12") {
                s[0] = "00";
            }
        }

        return s[0].concat(":", s[1], ":", s[2]);
    }

    const [date, changeDate] = useState<string>(getDate());
    const [time, changeTime] = useState<string>(getTime());
    const dateRef = useRef(null);
    const timeRef = useRef(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value) return;

        if (due == null) {
            var edit: ITodo = {
                id: todo.id,
                description: value,
                isDone: todo.isDone,
                addedBy: todo.addedBy,
                date: undefined
            }
        }
        else {
            var now = Date.now();
            if (due.valueOf() < now) {
                alert("You must select a date in the future")
                return;
            }
            var edit: ITodo = {
                id: todo.id,
                description: value,
                isDone: todo.isDone,
                addedBy: todo.addedBy,
                date: due
            }
        }
        editSubtask(parentId, edit);
        changeDate("");
        changeTime("");
        changeDue(undefined);
        changeEditing(false);
    };

    function _handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        // onChange();
        const value = e.target.value;
        const elid = e.target.id;
        var newStr: string = "";

        if ("elogdate" === elid) {
            changeDate(value);
            newStr = new String("").concat(value || "", " ", time || "");
        } else if ("elogtime" === elid) {
            changeTime(value);
            newStr = new String("").concat(date || "", " ", value || "");
        }
        changeDue(new Date(newStr));
    }

    const getClassName = () => {
        var now = Date.now();
        if (todo.date != undefined && todo.date.valueOf() < now && !todo.isDone) {
            return "my-1 danger";
        }
        else {
            return "my-1";
        }
    }

    if (!editing && !deleting) {
        return (
            <div>
                <Card className="subtask todo bgdark-alt border-0 my-2">
                    <Card.Body>
                        <div className="todo ">
                            <h5 style={{ textDecoration: todo.isDone ? "line-through" : "" }} className="my-2">
                                {todo.description}
                            </h5>
                            <div className={getClassName()}>
                                <strong>Date Due: </strong>{todo.date != null ? todo.date.toLocaleDateString() + " " + todo.date.toLocaleTimeString() : "None "}
                            </div>
                            <div className="my-1">
                                <strong>Added By: </strong>{todo.addedBy}
                            </div>
                            <div>
                                {!todo.isDone ?
                                    (
                                        <Button className="button-primary m-2" title="Mark as Done" variant="outline-success border-0" onClick={() => markSubtask(parentId, todo.id, true)}>
                                            <Icon icon="ic:baseline-done-outline" />
                                        </Button>
                                    ) :
                                    (
                                        <Button className="button-primary m-2" title="Mark as Not Done" variant="outline-success border-0" onClick={() => markSubtask(parentId, todo.id, false)}>
                                            <Icon icon="ic:round-remove-done" />
                                        </Button>
                                    )
                                }
                                <Button className="button m-2" title="edit" variant="outline-success border-0" onClick={() => changeEditing(true)}>
                                    <Icon icon="material-symbols:edit-outline-rounded" />
                                </Button>
                                <Button className="button-danger m-2" title="Delete" variant="outline-danger border-0" onClick={() => changeDeleting(true)}>
                                    <Icon icon="mdi:trash-can-outline" />
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }
    else if (deleting) {
        return (
            <div>
                <Card className="subtask todo bgdark-alt border-0 my-2">
                    <Card.Body>
                        <div className="">
                            <h5 style={{ textDecoration: todo.isDone ? "line-through" : "" }} className="my-2">
                                {todo.description}
                            </h5>
                            <strong>Are you sure you want to delete this todo? <br /></strong>
                            <strong className="danger">This action is irreversible!<br/></strong>
                            <Button className="button-danger my-2" onClick={() => removeSubtask(parentId, todo.id)}>Delete</Button>
                            <Button className="button-primary m-2" onClick={() => changeDeleting(false)}>Cancel</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }
    else {
        return (
            <div>
                <Card className="subtask todo bgdark-alt border-0 my-2">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Control
                                    required={true}
                                    type="text"
                                    className="input"
                                    value={value}
                                    onChange={(e) => changeValue(e.target.value)}
                                    placeholder="Edit description"
                                />
                                <>
                                    <input
                                        id="elogdate"
                                        ref={dateRef}
                                        value={date}
                                        onChange={(e) => _handleChange(e)}
                                        type="date"
                                    />
                                    <input
                                        id="elogtime"
                                        ref={timeRef}
                                        value={time}
                                        onChange={(e) => _handleChange(e)}
                                        type="time"
                                    />
                                </>
                            </Form.Group>
                            <Button className="button bgprimary my-3" type="submit">
                                Submit
                            </Button>
                            <Button className="button-danger my-3" onClick={() => changeEditing(false)}>
                                Cancel
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                {todo.subtasks?.map((subtask: ITodo, index: number) =>
                    <Subtask parentId={todo.id} key={index} todo={subtask} markSubtask={markSubtask} removeSubtask={removeSubtask} editSubtask={editSubtask} />
                )}
            </div>
        );
    }

}

export default Subtask;