import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";
import { Button, Form } from "react-bootstrap";

type Props = {
    changePage: React.Dispatch<React.SetStateAction<string>>;
    signIn: (email: string, password: string) => void;
    changeLoading: (value: React.SetStateAction<boolean>) => void;
    google(): Promise<void>;
}

const SignIn: React.FC<Props> = ({ changeLoading, changePage, signIn, google }) => {
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
        <div className="row login">
            <title>
                Sign In
            </title>
            <div className="imageContainer">
                <Image className="loginImage" src="/images/signin.svg" width={32} height={32} alt="Sign In" />
            </div>
            <div className="bgdark sign">
                <div className="content">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>
                                <h2 className="primary">Sign In<br /></h2>
                            </Form.Label>
                            <Form.Control
                                required={true}
                                type="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                            />
                            <Form.Control
                                required={true}
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                            />
                        </Form.Group>
                        <Button className="button-primary bgprimary my-3" type="submit">
                            Submit
                        </Button>
                    </Form>
                    <div className="row">
                        <a className="light" onClick={() => changePage("reset")}>
                            Reset Password
                        </a>
                        <a className="light" onClick={() => changePage("signup")}>
                            Sign Up
                        </a>
                    </div>
                    <hr />
                    <h3 className="light">
                        Other Sign-in Methods
                    </h3>
                    <div className="row">
                        <div className="col">
                            <Button className="button-none" onClick={google}>
                                <Icon icon="logos:google-icon" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;
