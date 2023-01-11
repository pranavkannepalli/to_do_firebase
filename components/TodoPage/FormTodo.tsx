import * as React from "react";
import { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";

type Props = {
  addTodo: (text: string, date: Date | undefined) => void;
};

const FormTodo: React.FC<Props> = ({ addTodo }) => {
  const [value, setValue] = useState<string>("");
  const [due, setDue] = useState<Date>();
  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<string>();
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value, due);
    setValue("");
  };

  function _handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // onChange();
    const value = e.target.value;
    const elid = e.target.id;
    var newStr:string = "";

    if ("elogdate" === elid) {
      setDate(value);
      newStr = new String("").concat(value||"0000-00-00", " ", time||"00:00");
    } else if ("elogtime" === elid) {
      setTime(value);
      newStr = new String("").concat(date||"0000-00-00", " ", value||"00:00");
    }
    setDue(new Date(newStr));
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Control
          required={true}
          type="text"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add new todo"
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
        <small>
          <i>Date you set: {due?.toISOString()}</i>
        </small>
      </Form.Group>
      <Button className="button bgprimary my-3" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default FormTodo;