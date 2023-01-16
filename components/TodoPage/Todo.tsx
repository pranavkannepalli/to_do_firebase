import React from "react";
import { Button, Form } from "react-bootstrap";
import { ITodo } from "../../types";
import { Icon } from '@iconify/react';
import { useState, useRef } from "react";

type Props = {
    todo: ITodo;
    markTodo: (id: number, done: boolean) => void;
    removeTodo: (id: number) => void;
    editTodo: (todo: ITodo) => void;
}

const Todo: React.FC<Props> = ({ todo, markTodo, removeTodo, editTodo }) => {
    const [editing, changeEditing] = useState<boolean>(false);

    const [value, setValue] = useState<string>(todo.description);
    const [due, setDue] = useState<Date>();

    const getDate = () => {
        if (todo.date == null) return "";
        var date:string = todo.date.toLocaleDateString();
        var s:string[] = date.split("/");
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
        if (todo.date == null) return "";
        return todo.date.toLocaleTimeString();
    }

    const [date, setDate] = useState<string>(getDate());
    const [time, setTime] = useState<string>(getTime());
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
            var edit: ITodo = {
                id: todo.id,
                description: value,
                isDone: todo.isDone,
                addedBy: todo.addedBy,
                date: due
            }
        }
        editTodo(edit);
        setDate("");
        setTime("");
        setDue(undefined);
        changeEditing(false);
    };

    function _handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        // onChange();
        const value = e.target.value;
        const elid = e.target.id;
        var newStr: string = "";

        if ("elogdate" === elid) {
            setDate(value);
            newStr = new String("").concat(value || "", " ", time || "");
        } else if ("elogtime" === elid) {
            setTime(value);
            newStr = new String("").concat(date || "", " ", value || "");
        }
        setDue(new Date(newStr));
    }

    if (!editing) {
        return (
            <div className="todo ">
                <h5 style={{ textDecoration: todo.isDone ? "line-through" : "" }} className="my-2">
                    {todo.description}
                </h5>
                <div className="my-1">
                    <strong>Date Due: </strong>{todo.date != null ? todo.date.toLocaleDateString() + " " + todo.date.toLocaleTimeString() : "None "}
                </div>
                <div className="my-1">
                    <strong>Added By: </strong>{todo.addedBy}
                </div>
                <div>
                    {!todo.isDone ?
                        (
                            <Button className="button-primary m-2" title="Mark as Done" variant="outline-success border-0" onClick={() => markTodo(todo.id, true)}>
                                <Icon icon="ic:baseline-done-outline" />
                            </Button>
                        ) :
                        (
                            <Button className="button-primary m-2" title="Mark as Not Done" variant="outline-success border-0" onClick={() => markTodo(todo.id, false)}>
                                <Icon icon="ic:round-remove-done" />
                            </Button>
                        )
                    }
                    <Button className="button m-2" title="edit" variant="outline-success border-0" onClick={() => changeEditing(true)}>
                        <Icon icon="material-symbols:edit-outline-rounded" />
                    </Button>
                    <Button className="button-danger m-2" title="Delete" variant="outline-danger border-0" onClick={() => removeTodo(todo.id)}>
                        <Icon icon="mdi:trash-can-outline" />
                    </Button>
                </div>
            </div>
        )
    }
    else {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control
                        required={true}
                        type="text"
                        className="input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
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
            </Form>
        );
    }

}

export default Todo;