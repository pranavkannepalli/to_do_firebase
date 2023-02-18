import * as React from "react";
import { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { createFalse } from "typescript";

type Props = {
    parentId: number;
    changeAdding: React.Dispatch<React.SetStateAction<boolean>>;
    addSubtask: (parentId: number, text: string, date: Date | undefined) => void;
};

const FormSubtask: React.FC<Props> = ({ parentId, changeAdding, addSubtask }) => {
    const [value, setValue] = useState<string>("");
    const [due, setDue] = useState<Date>();
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
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
        addSubtask(parentId, value, due);
        setDate("");
        setTime("");
        setDue(undefined);
        setValue("");
        changeAdding(false)
    };

    function _handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        // onChange();
        const value = e.target.value;
        const elid = e.target.id;
        var newStr: string = "";

        if ("elogdate1" === elid) {
            setDate(value);
            newStr = new String("").concat(value || "", " ", time || "");
        } else if ("elogtime1" === elid) {
            setTime(value);
            newStr = new String("").concat(date || "", " ", value || "");
        }
        setDue(new Date(newStr));
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Add a Subtask</Form.Label>
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
                        id="elogdate1"
                        ref={dateRef}
                        value={date}
                        onChange={(e) => _handleChange(e)}
                        type="date"
                    />
                    <input
                        id="elogtime1"
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
            <Button className="button-danger my-3" onClick={() => changeAdding(false)}>
                Cancel
            </Button>
        </Form>
    );
};

export default FormSubtask;