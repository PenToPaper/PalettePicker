import React, { useState, useEffect, useRef } from "react";
import FocusTrap from "focus-trap-react";

// https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html = Nav
// https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/alertdialog.html = ProjectConfirmDelete
export function ProjectManagedInput(props) {
    const input = useRef(null);

    useEffect(() => {
        input.current.focus();
    }, []);

    return (
        <input
            value={props.value}
            onChange={(e) => {
                props.onChange(e.target.value);
            }}
            ref={input}
            aria-label="Modify the name of the project"
        />
    );
}

export function ProjectSelectButton(props) {
    return (
        <button
            className="project"
            onClick={() => {
                props.onClick();
            }}
        >
            {props.value}
        </button>
    );
}

export function ProjectConfirmDelete(props) {
    const deny = useRef(null);

    useEffect(() => {
        deny.current.focus();
    }, []);

    const handleButtonKeyDown = (event) => {
        switch (event.keyCode) {
            // Escape
            case 27:
                props.onConfirmingDelete(-1);
                break;
        }
    };

    return (
        <FocusTrap>
            <div className="project-delete" role="alertdialog" aria-modal="true" aria-labelledby={`${props.index}-proj-delete-desc`} onKeyDown={handleButtonKeyDown}>
                <button
                    className="confirm-delete-project"
                    onClick={() => {
                        props.onDeleteProject(props.index);
                        props.onConfirmingDelete(-1);
                    }}
                />
                <span id={`${props.index}-proj-delete-desc`}>Delete this project?</span>
                <button
                    className="deny-delete-project"
                    onClick={() => {
                        props.onConfirmingDelete(-1);
                    }}
                    ref={deny}
                />
            </div>
        </FocusTrap>
    );
}

export const Project = React.forwardRef((props, ref) => {
    return (
        <li className={props.selected ? "project-selected" : ""} key={props.index} id={"project-" + props.index} aria-selected={props.selected ? "true" : "false"} role="menuitem">
            <button
                className="nav-modifier"
                onClick={() => {
                    props.onEditingClick(props.index);
                }}
                ref={ref}
            >
                {props.editing ? <img src="/assets/materialicons/material_save_offblack.svg" alt="Save Project Label" /> : <img src="/assets/materialicons/material_create_offblack.svg" alt="Edit Project Label" />}
            </button>
            {props.editing ? (
                <ProjectManagedInput value={props.projectName} onChange={(newName) => props.onProjectNameChange(props.index, newName)} />
            ) : (
                <ProjectSelectButton value={props.projectName} onClick={() => props.onSelectProject(props.index)} />
            )}
            <button
                className="nav-modifier"
                onClick={() => {
                    props.onConfirmingDelete(props.index);
                }}
            >
                <img src="/assets/materialicons/material_delete_offblack.svg" alt="Delete Project"></img>
            </button>
            {props.confirmingDelete && <ProjectConfirmDelete index={props.index} onDeleteProject={props.onDeleteProject} onConfirmingDelete={props.onConfirmingDelete} />}
        </li>
    );
});

export default function Nav(props) {
    const [editing, setEditing] = useState(-1);
    const [confirmingDelete, setConfirmingDelete] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);

    const firstButtonRefs = useRef([]);

    useEffect(() => {
        firstButtonRefs.current = new Array(props.projects.length);
    }, [props.projects.length]);

    const handleEditingClick = (index) => {
        setEditing((prevEditing) => {
            if (prevEditing === index) {
                return -1;
            }
            return index;
        });
    };

    const focusProject = (index) => {
        firstButtonRefs.current[index].focus();
        return index;
    };

    const focusNextProject = (currentIndex) => {
        const nextIndex = currentIndex + 1;
        if (!(firstButtonRefs.current.length <= nextIndex) && firstButtonRefs.current[nextIndex] !== null) {
            focusProject(nextIndex);
            return nextIndex;
        } else {
            focusProject(0);
            return 0;
        }
    };

    const focusPreviousProject = (currentIndex) => {
        const nextIndex = currentIndex - 1;
        if (nextIndex >= 0 && firstButtonRefs.current[nextIndex] !== null) {
            focusProject(nextIndex);
            return nextIndex;
        } else {
            focusProject(firstButtonRefs.current.length - 1);
            return firstButtonRefs.current.length - 1;
        }
    };

    const getCurrentlyFocusedElementByEvent = (event) => {
        const closestLi = event.target.closest("li");
        if (closestLi === null) {
            return null;
        }
        const strippedString = closestLi.id.substring(8);
        return parseInt(strippedString);
    };

    const handleButtonKeyDown = (event) => {
        const currentElement = getCurrentlyFocusedElementByEvent(event);
        if (currentElement === null) {
            return;
        }
        switch (event.keyCode) {
            // Arrow right
            case 39:
            // Arrow down
            case 40:
                event.preventDefault();
                return focusNextProject(currentElement);
            // Arrow left
            case 37:
            // Arrow up
            case 38:
                event.preventDefault();
                return focusPreviousProject(currentElement);
            // Home
            case 36:
                event.preventDefault();
                return focusProject(0);
            // End
            case 35:
                event.preventDefault();
                return focusProject(firstButtonRefs.current.length - 1);
            // Space
            case 32:
                if (editing === -1) {
                    event.preventDefault();
                }
                return undefined;
            default:
                return undefined;
        }
    };

    const toggle = () => {
        setIsOpen((prevIsOpen) => {
            props.toggle(!prevIsOpen);
            return !prevIsOpen;
        });
    };

    return (
        <FocusTrap active={isOpen}>
            <nav role="navigation" className={isOpen ? "hamburger-menu-expanded" : ""} onKeyDown={handleButtonKeyDown}>
                <img src="/assets/PalettePickerLogo.svg" alt="Palette Picker Logo" />
                <button className="hamburger-menu-container" aria-label="Toggle the Project Menu" aria-expanded={isOpen ? "true" : "false"} aria-controls="hamburger-menu-body" onClick={toggle}>
                    <img src="/assets/materialicons/material_menu_offwhite.svg" alt="" />
                </button>
                <div id="hamburger-menu-body" aria-label="Your Projects" hidden={!isOpen}>
                    <ul role="menubar" aria-label="Load, delete, and edit PalettePicker saved projects">
                        {props.projects.map((project, index) => {
                            return (
                                <Project
                                    key={project}
                                    ref={(el) => (firstButtonRefs.current[index] = el)}
                                    selected={index === props.activeProject}
                                    index={index}
                                    editing={editing === index}
                                    projectName={project}
                                    confirmingDelete={confirmingDelete === index}
                                    onProjectNameChange={props.onProjectNameChange}
                                    onSelectProject={props.onSelectProject}
                                    onDeleteProject={props.onDeleteProject}
                                    onConfirmingDelete={setConfirmingDelete}
                                    onEditingClick={handleEditingClick}
                                />
                            );
                        })}
                    </ul>
                    <button
                        className="add-project"
                        onClick={() => {
                            props.onAddProject();
                        }}
                    >
                        <img src="/assets/materialicons/material_playlist_add_offblack.svg" alt="" />
                        Add Project
                    </button>
                </div>
            </nav>
        </FocusTrap>
    );
}
