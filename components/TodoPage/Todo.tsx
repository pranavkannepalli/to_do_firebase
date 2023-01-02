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
                <span>Added By: </span>{todo.addedBy}
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