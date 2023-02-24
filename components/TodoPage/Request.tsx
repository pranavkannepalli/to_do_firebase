import React, {useState} from "react";
import { Button } from "react-bootstrap";
import { GroupRequest } from "../../types";
import { auth } from "../../firebase_setup";
import { Icon } from '@iconify/react';

type Props = {
    request: GroupRequest;
    acceptRequest: (request: GroupRequest) => void;
    deleteRequest: (request: GroupRequest) => void;
}

const Request: React.FC<Props> = ({ request, acceptRequest, deleteRequest }) => {
    const [deleting, changeDeleting] = useState<boolean>(false);

    if (request.username != auth.currentUser?.displayName && !deleting) {
        return (
            <div className="todo">
                <h5 className="my-2">
                    <strong>Join Request</strong>
                </h5>
                <div className="my-1">
                    {request.username} wants to join this group
                </div>
                <Button variant="outline-success" onClick={(e) => acceptRequest(request)}>
                    <Icon icon="ic:ic:baseline-done-outline" />
                </Button>
                <Button variant="outline-danger" onClick={(e) => deleteRequest(request)}>
                    <Icon icon="mdi:trash-can-outline" />
                </Button>
            </div>
        )
    }
    else if (request.username != auth.currentUser?.displayName && deleting) {
        return (
            <div className="todo">
                <h5 className="my-2">
                    <strong>Join Request from {request.username}</strong>
                </h5>
            </div>
        )
    }
    else {
        return <div>Request sent</div>;
    }
}

export default Request;