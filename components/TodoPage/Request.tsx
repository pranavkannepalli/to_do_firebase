import React from "react";
import { Button } from "react-bootstrap";
import { GroupRequest, ITodo } from "../../types";

type Props = {
    request: GroupRequest;
    acceptRequest: (request: GroupRequest) => void;
    declineRequest: (request: GroupRequest) => void;
}

const Request: React.FC<Props> = ({ request, acceptRequest, declineRequest }) => {
    return (
        <div className="todo bg-dark">
            <h5 className="my-2">
                Join Request
            </h5>
            <div>
                {request.email} wants to join this group
            </div>
            <Button>
                Accept
            </Button>
            <Button>
                Decline
            </Button>
        </div>
    )
}

export default Request;