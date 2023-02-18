import { Icon } from "@iconify/react";
import React from "react";
import { Button } from "react-bootstrap";
import { signInWithGoogle } from "../../firebase_setup";

type Props = {
    changePage: React.Dispatch<React.SetStateAction<string>>;
    signUp: (email: string, password: string) => void;
    changeLoading: (value: React.SetStateAction<boolean>) => void
}

const SignUp: React.FC<Props> = ({ changePage, signUp, changeLoading }) => {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [repeatPassword, setRepeat] = React.useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        if (!password) return;
        if (password != repeatPassword) {
            alert("Passwords do not match")
            return;
        };
        signUp(email, password);
        setEmail("");
        setPassword("");
    }

    async function google() {
        changeLoading(true);
        await signInWithGoogle().then(() => changeLoading(false)).catch((error) => alert(error));
    }

    return (
        <div className="grad">
            <div className="bgdark sign">
                <h2 className="primary">Sign Up<br /></h2>
                <form onSubmit={handleSubmit}>
                    <input required={true} type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                    <input required={true} aria-describedby="password1" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                    <span id="password1" className={password.length < 8 ? "danger" : "success"}>{password.length < 8 ? "Password needs to be more than 8 letters" : "Password is more than 8 letters"}</span>
                    <input required={true} aria-describedby="password2" type="password" className="form-control" value={repeatPassword} onChange={(e) => setRepeat(e.target.value)} placeholder="Retype password" />
                    <span id="password2" className={password != repeatPassword ? "danger" : "success"}>{password != repeatPassword ? "Passwords don't match" : "Passwords are matching"}</span><br />
                    <Button className="button-primary my-3" type="submit">
                        Submit
                    </Button>
                </form>
                <hr />
                <h3 className="light">
                    Other Sign-in Methods
                </h3>
                <div className="row">
                    <div className="col">
                        <Button onClick={google}>
                            <Icon icon="logos:google-icon"/>
                        </Button>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col">
                        <div className="light">
                            Forgot Password?
                        </div>
                        <Button className="button-primary" onClick={() => changePage("reset")}>
                            Reset
                        </Button>
                    </div>
                    <div className="col">
                        <div className="light">
                            Need an Account?
                        </div>
                        <Button className="button-primary bgprimary" onClick={() => changePage("signin")}>Sign In</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
