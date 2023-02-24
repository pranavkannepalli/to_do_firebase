import {auth, db} from "../../firebase_setup";
import firebase from "firebase/compat/app"
import React, {useState} from "react";
import {Form, Button} from "react-bootstrap"

type Props = {
    changeDeleting: React.Dispatch<React.SetStateAction<boolean>>;
    changeUserExists: (value: React.SetStateAction<boolean>) => void;
}

const DeletePopup : React.FC<Props> = ({changeDeleting, changeUserExists}) => {

    const [currentP, changeCurrentP] = useState<string>("");

    const deleteAccount  = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        var user = auth.currentUser;
        if (currentP == "") {
            return;
        }
        if (user == null || user.email == null) {
            alert("Something's fishy. Try refreshing and trying again.")
            return;
        }
        alert(currentP)
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentP)
        user.reauthenticateWithCredential(cred).then(() => {
            var user = firebase.auth().currentUser;
            if (user) {
                var uid = user.uid;
                user?.delete().then(() => {
                    db.ref(`${uid}`).remove();
                }).catch((error) => alert(error))
                alert("Deleted user. Sad to see you go.");
                changeDeleting(false);
                changeUserExists(false);
            }
        }).catch((error) => {
            if (error == "FirebaseError: Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).") {
                alert("Wrong current password or user does not have a password.");
                return;
            }
            else {
                alert(error)
                return;
            }
        })
    }

    return (
        <div className="delete-container dark">
            <h2>Are you sure you want to delete your account?</h2>
            <strong className="danger">THIS ACTION IS IRREVERSIBLE!</strong>
            <Form className="my-2" onSubmit={(e) => deleteAccount(e)}>
                <Form.Label htmlFor="pass">Please give password confirmation</Form.Label>
                <Form.Control 
                id="pass"
                type="password" 
                required={true}
                placeholder="Confirm password"
                onChange={(e) => changeCurrentP(e.target.value)}/>
                <br/>
                <Button type="submit" className="button-danger my-2">Delete</Button>
                <Button className="button-primary m-2" onClick={()=>changeDeleting(false)}>Cancel</Button>
            </Form>
        </div>
    )
}

export default DeletePopup;