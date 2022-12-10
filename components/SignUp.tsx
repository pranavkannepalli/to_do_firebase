import React from "react";
import { Button, Form } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

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
        if (password.length < 8) return;
        signUp(email, password);
        setEmail("");
        setPassword("");
        console.log("Signed up");
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>
                    <b>Sign Up<br /></b>
                </Form.Label>
                <Form.Control
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                />
                <Form.Control
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                />
                <Form.Control
                    type="password"
                    className="input"
                    value={repeatPassword}
                    onChange={(e) => setRepeat(e.target.value)}
                    placeholder="Repeat Password"
                />
                <ListGroup>
                    <ListGroup.Item variant={password.length < 8 ? "danger" : "success"} className="my-2">
                        {password.length < 8 ? "Password needs to be more than 8 letters" : "Password is more than 8 letters"}
                    </ListGroup.Item>
                    <ListGroup.Item variant={password != repeatPassword ? "danger" : "success"} className="my-2">
                        {password != repeatPassword ? "Passwords don't match" : "Passwords are matching"}
                    </ListGroup.Item>
                </ListGroup>
            </Form.Group>
            <Button variant="primary mb-3" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default SignUp;