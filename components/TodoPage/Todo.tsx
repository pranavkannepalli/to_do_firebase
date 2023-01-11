import React from "react";
import { Button } from "react-bootstrap";
import { ITodo } from "../../types";
import { Icon } from '@iconify/react';

type Props = {
    todo: ITodo;
    markTodo: (id: number) => void;
    removeTodo: (id: number) => void;
}

const Todo: React.FC<Props> = ({ todo, markTodo, removeTodo }) => {
    return (
        <div className="todo ">
            <h5 style={{ textDecoration: todo.isDone ? "line-through" : "" }} className="my-2">
                {todo.description}
            </h5>
            <div className="my-1">
                <strong>Date Due: </strong>{todo.date != null ? todo.date.toLocaleDateString() + " " : "None "}
                <strong>Time Due: </strong>{todo.date != null ? todo.date.toLocaleTimeString() : "None "}
            </div>
            <div className="my-1">
                <strong>Added By: </strong>{todo.addedBy}
            </div>
            <div>
                {!todo.isDone && (<Button variant="outline-success border-0" onClick={() => markTodo(todo.id)}>
                    <Icon icon="ic:baseline-done-outline" />
                </Button>)}
                <Button variant="outline-danger border-0" onClick={() => removeTodo(todo.id)}>
                    <Icon icon="mdi:trash-can-outline" />
                </Button>
            </div>
        </div>
    )
}

export default Todo;