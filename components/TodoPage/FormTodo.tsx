import * as React from "react";
import { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import Tags from "./Tags";

type Props = {
  createTag: (tagName: string) => void;
  addTodo: (text: string, date: Date | undefined, tag: string) => void;
  tags: string[];
};

const FormTodo: React.FC<Props> = ({ createTag, addTodo, tags }) => {
  const [value, setValue] = useState<string>("");
  const [due, setDue] = useState<Date>();
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [tag, setTag] = useState<string>("Untagged");
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    var now = Date.now();
    if (due != undefined && due.valueOf() < now) {
      setDate("");
      setTime("");
      setDue(undefined);
      alert("You must select a date in the future")
      return;
    }
    addTodo(value, due, tag);
    setTag("Untagged")
    setDate("");
    setTime("");
    setDue(undefined);
    setValue("");
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
            title="Select Date"
            ref={dateRef}
            value={date}
            onChange={(e) => _handleChange(e)}
            type="date"
          />
          <input
            id="elogtime"
            title="Select Time"
            ref={timeRef}
            value={time}
            onChange={(e) => _handleChange(e)}
            type="time"
          />
        </>
      </Form.Group>
      <Tags title={"Select a Tag"} tags={tags} handleClick={setTag} createTag={createTag}/>
        <Button className="button bgprimary my-3" type="submit">
          Submit
        </Button>
    </Form>
  );
};

export default FormTodo;