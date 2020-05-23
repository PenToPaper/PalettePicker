import React, { useState } from "react";

export default function Nav(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState(-1);
    const [confirmingDelete, setConfirmingDelete] = useState(-1);

    const handleEditingClick = (index) => {
        setEditing((prevEditing) => {
            if (prevEditing === index) {
                return -1;
            }
            return index;
        });
    };

    // TODO: Make accessible
    // TODO: Un-spaghetti
    return (
        <nav role="navigation" className={isOpen ? "hamburger-menu-expanded" : ""}>
            <img src="/assets/PalettePickerLogo.svg" alt="Palette Picker Logo" />
            <button className="hamburger-menu-container" aria-label="Toggle the Project Menu" aria-expanded={isOpen ? "true" : "false"} aria-controls="hamburger-menu-body" onClick={() => setIsOpen(!isOpen)}>
                <img src="/assets/materialicons/material_menu_offwhite.svg" alt="" />
            </button>
            <div id="hamburger-menu-body" aria-label="Your Projects" hidden={!isOpen}>
                <ul>
                    {props.projects.map((project, index) => {
                        return (
                            <li className={index === props.activeProject ? "project-selected" : ""} key={index} aria-selected={index === props.activeProject ? "true" : "false"}>
                                <button
                                    className="nav-modifier"
                                    onClick={() => {
                                        handleEditingClick(index);
                                    }}
                                >
                                    {editing === index ? <img src="/assets/materialicons/material_save_offwhite.svg" alt="Save Project Text" /> : <img src="/assets/materialicons/material_create_offwhite.svg" alt="Edit Project Text" />}
                                </button>
                                {editing === index ? (
                                    <input
                                        value={project}
                                        onChange={(e) => {
                                            props.onProjectNameChange(index, e.target.value);
                                        }}
                                    />
                                ) : (
                                    <button
                                        className="project"
                                        onClick={() => {
                                            props.onSelectProject(index);
                                        }}
                                    >
                                        {project}
                                    </button>
                                )}
                                <button
                                    className="nav-modifier"
                                    onClick={() => {
                                        setConfirmingDelete(index);
                                    }}
                                >
                                    <img src="/assets/materialicons/material_delete_offwhite.svg" alt="Delete Project"></img>
                                </button>
                                {confirmingDelete === index && (
                                    <div className="project-delete">
                                        <span>Confirm delete project?</span>
                                        <button
                                            className="confirm-delete-project"
                                            onClick={() => {
                                                props.onDeleteProject(index);
                                                setConfirmingDelete(-1);
                                            }}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            className="deny-delete-project"
                                            onClick={() => {
                                                setConfirmingDelete(-1);
                                            }}
                                        >
                                            No
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <button
                    className="add-project"
                    onClick={() => {
                        props.onAddProject();
                    }}
                >
                    <img src="/assets/materialicons/material_add_offwhite.svg" alt="" />
                    Add Project
                </button>
            </div>
        </nav>
    );
}
