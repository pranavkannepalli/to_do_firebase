
import * as React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

type Props = {
    title: string;
    tags: string[];
    handleClick: (tag: string) => void;
    createTag: (tagName: string) => void;
}

const Tags: React.FC<Props> = ({ title, tags, createTag, handleClick }) => {
    const [t, changeT] = React.useState(title);
    const [newTag, changeNewTag] = React.useState("");

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log("Is this working?")
        e.preventDefault();
        createTag(newTag);
        changeNewTag("");
    }

    return (
        <DropdownButton variant="secondary" id="dropdown-basic-button" title={t}>
            {tags.map((tag, index) => (
                <Dropdown.Item className="dropdown-item" onClick={(e) => { handleClick(tag); changeT(tag) }} key={index}>
                    {tag}
                </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <div className="input-group p-2">
                <input type="text" className="form-control" value={newTag} onChange={(e) => changeNewTag(e.target.value)} placeholder="Add new tag" />
                <button className="btn btn-outline-secondary" onClick={(e) => handleSubmit(e)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 17H13V13H17V11H13V7H11V11H7V13H11V17ZM5 21C4.45 21 3.979 20.8043 3.587 20.413C3.19567 20.021 3 19.55 3 19V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H19C19.55 3 20.021 3.19567 20.413 3.587C20.8043 3.979 21 4.45 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.021 20.8043 19.55 21 19 21H5ZM5 19H19V5H5V19ZM5 5V19V5Z" fill="black" />
                    </svg>
                </button>
            </div>
        </DropdownButton>
    )
}

export default Tags;