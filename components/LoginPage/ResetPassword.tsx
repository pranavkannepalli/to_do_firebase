import React from "react";
import { Button, Form } from "react-bootstrap";
import { auth } from "../../firebase_setup";
import Image from "next/image"

type Props = {
    changePage: React.Dispatch<React.SetStateAction<string>>;
}

const ResetPassword: React.FC<Props> = ({ changePage }) => {
    const [email, setEmail] = React.useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            auth.sendPasswordResetEmail(email)
            alert("Reset email sent.")
        }
        catch(error) {
            alert(error)
        }
        setEmail("")
        changePage("signin")
    }

    return (
        <div className="row login">
            <title>
                Sign Up
            </title>
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
                        </Form.Group>
                        <Button className="button-primary bgprimary my-3" type="submit">
                            Submit
                        </Button>
                    </Form>
                    <a className="light" onClick={() => changePage("signin")}>Return to Sign In</a>
                </div>
            </div>
            <div className="imageContainer">
                <Image className="loginImage" src="/images/forgotpassword.svg" width={32} height={32} alt="Forgot Password"/>
            </div>
        </div>
    )
}

export default ResetPassword;
