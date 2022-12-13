import React from "react";
import { Button } from "react-bootstrap";
import { ITodo } from "../../types";

type Props = {
    todo: ITodo;
    markTodo: (id: number) => void;
    removeTodo: (id: number) => void;
}

const Todo: React.FC<Props> = ({ todo, markTodo, removeTodo }) => {
    return (
        <div className="todo bg-dark">
            <h5 style={{ textDecoration: todo.isDone ? "line-through" : "" }} className="my-2">
                {todo.description}
            </h5>
            <div>
                <span>Added By: </span>{todo.addedBy}
            </div>
            <div>
                {!todo.isDone && (<Button variant="outline-success" onClick={() => markTodo(todo.id)}>
                    ✔️
                </Button>)}
                <Button variant="outline-danger" onClick={() => removeTodo(todo.id)}>
                    ❌
                </Button>
            </div>
        </div>
    )
}

export default Todo;