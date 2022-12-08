import React from "react";
import { Button, Form } from "react-bootstrap";

type Props = {
    signUp: (email: string, password: string) => void;
}

const SignUp: React.FC<Props> = ({ signUp }) => {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [repeatPassword, setRepeat] = React.useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);
        console.log(password);
        if (!email) return;
        if (!password) return;
        if (password != repeatPassword) return;
        signUp(email, password);
        setEmail("");
        setPassword("");
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>
                    <b>Sign Up<br/></b>
                </Form.Label>
                <Form.Control
                type = "email"
                className = "input"
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                />
                <Form.Control
                type = "password"
                className = "input"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                />
                <Form.Control
                type = "password"
                className = "input"
                value = {repeatPassword}
                onChange={(e) => setRepeat(e.target.value)}
                placeholder="Repeat Password"
                />
                {password != repeatPassword ? <div>Passwords do not match</div> : <div></div>}
            </Form.Group>
            <Button variant="primary mb-3" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default SignUp;