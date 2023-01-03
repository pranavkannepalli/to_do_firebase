import React from "react";
import { Button, Form } from "react-bootstrap";

type Props = {
    changePage: React.Dispatch<React.SetStateAction<string>>;
    signIn: (email: string, password: string) => void;
}

const SignIn: React.FC<Props> = ({ changePage, signIn }) => {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        if (!password) return;
        signIn(email, password);
        setEmail("");
        setPassword("");
    }

    return (
        <div className="grad">
            <div className="bgdark sign">
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>
                            <h2 className="primary">Sign In<br /></h2>
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
                    </Form.Group>
                    <Button className="button bgprimary my-3" type="submit">
                        Submit
                    </Button>
                </Form>
                <div className="light">
                    Need an Account?
                </div>
                <Button className="btn button bgprimary" onClick={() => changePage("signup")}>Sign Up</Button>
            </div>
        </div>
    )
}

export default SignIn;