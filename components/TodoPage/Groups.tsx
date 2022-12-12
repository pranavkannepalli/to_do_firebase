import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';

type Props = {
    groups: string[];
    changeCurrentGroup: (value: React.SetStateAction<string>) => void;
}

const groupPage: React.FC<Props> = ({ groups, changeCurrentGroup }) => {
    const groupsNonsense = (group: string) => {
        changeCurrentGroup(group);
    }

    return (
        <DropdownButton id="dropdown-button-basic" title="Groups">
            {groups.map((group, index) => (
                <Dropdown.Item onClick={() => groupsNonsense(group)} key={index}>{group}</Dropdown.Item>
            ))}
        </DropdownButton>
    )
}

export default groupPage;