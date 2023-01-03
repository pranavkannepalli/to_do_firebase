import React from "react";
import { Button } from "react-bootstrap";

type Props = {
    changePage: React.Dispatch<React.SetStateAction<string>>;
    signUp: (email: string, password: string) => void;
}

const SignUp: React.FC<Props> = ({ changePage, signUp }) => {
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
        <div className="grad">
            <div className="bgdark sign">
                <h2 className="primary">Sign Up<br /></h2>
                <form onSubmit={handleSubmit}>
                    <input required={true} type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email"/>
                    <div className="input-group">
                        <input required={true} aria-describedby="password1" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"/>
                        <span id="password1" className={password.length < 8 ? "input-group-text danger" : "input-group-text success"}>{password.length < 8 ? "Password needs to be more than 8 letters" : "Password is more than 8 letters"}</span>
                    </div>
                    <div className="input-group">
                        <input required={true} aria-describedby="password2" type="password" className="form-control" value={repeatPassword} onChange={(e) => setRepeat(e.target.value)} placeholder="Retype password"/>
                        <span id="password2" className={password != repeatPassword ? "input-group-text danger" : "input-group-text success"}>{password != repeatPassword ? "Passwords don't match" : "Passwords are matching"}</span>
                    </div>
                    <Button className="button bgprimary my-3" type="submit">
                        Submit
                    </Button>
                </form>
                <div className="light">
                    Already have an Account?
                </div>
                <Button className="btn button bgprimary" onClick={() => changePage("signin")}>Sign In</Button>
            </div>
        </div>
    )
}

export default SignUp;