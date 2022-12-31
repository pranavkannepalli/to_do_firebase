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
        if (!email) return;
        if (!password) return;
        if (password != repeatPassword) return;
        if (password.length < 8) return;
        signUp(email, password);
        setEmail("");
        setPassword("");
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>
                    <span><h2>Sign Up<br /></h2></span>
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
                <ListGroup className="my-2">
                    <ListGroup.Item className={password.length < 8 ? "danger " : "success "}>
                        {password.length < 8 ? "Password needs to be more than 8 letters" : "Password is more than 8 letters"}
                    </ListGroup.Item>
                    <ListGroup.Item className={password != repeatPassword ? "danger " : "success "}>
                        {password != repeatPassword ? "Passwords don't match" : "Passwords are matching"}
                    </ListGroup.Item>
                </ListGroup>
            </Form.Group>
            <Button className="secondary my-3" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default SignUp;