import { Icon } from "@iconify/react";
import React, {useState} from "react";
import { Button } from "react-bootstrap";
import Image from "next/image";

type Props = {
    changePage: React.Dispatch<React.SetStateAction<string>>;
    signUp: (email: string, password: string, displayName: string) => void;
}

const SignUp: React.FC<Props> = ({ changePage, signUp }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeatPassword, setRepeat] = useState<string>("");
    const [displayName, setDisplay] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        if (!password) return;
        if (password != repeatPassword) {
            alert("Passwords do not match")
            return;
        };
        signUp(email, password, displayName);
        setEmail("");
        setPassword("");
    }

    return (
        <div className="row login">
            <title>
                Sign Up
            </title>
            <div className="imageContainer">
                <Image className="loginImage" src="/images/signup.svg" width={32} height={32} alt="Sign Up"/>
            </div>
            <div className="bgdark sign">
                <div className="content">
                    <h2 className="primary">Sign Up<br /></h2>
                    <form onSubmit={handleSubmit}>
                        <input required={true} type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                        <input required={true} type="text" className="form-control" value={displayName} onChange={(e) => setDisplay(e.target.value)} placeholder="Choose a username"/>
                        <input required={true} aria-describedby="password1" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                        <span id="password1" className={password.length < 8 ? "danger" : "success"}>{password.length < 8 ? "Password needs to be more than 8 letters" : "Password is more than 8 letters"}</span>
                        <input required={true} aria-describedby="password2" type="password" className="form-control" value={repeatPassword} onChange={(e) => setRepeat(e.target.value)} placeholder="Retype password" />
                        <span id="password2" className={password != repeatPassword ? "danger" : "success"}>{password != repeatPassword ? "Passwords don't match" : "Passwords are matching"}</span><br />
                        <Button className="button-primary my-3" type="submit">
                            Submit
                        </Button>
                    </form>
                    <div className="row">
                        <a className="light" onClick={() => changePage("reset")}>
                            Reset Password
                        </a>
                        <a className="light" onClick={() => changePage("signin")}>
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
