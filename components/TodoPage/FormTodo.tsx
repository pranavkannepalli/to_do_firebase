import * as React from "react";
import { Button, Form } from "react-bootstrap";

type Props = {
  addTodo: (text: string) => void;
};

const FormTodo: React.FC<Props> = ({ addTodo }) => {
  const [value, setValue] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>
          <b>Add Todo</b>
        </Form.Label>
        <Form.Control
          type="text"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add new todo"
        />
      </Form.Group>
      <Button className="secondary my-3" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default FormTodo;