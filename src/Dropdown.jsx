import React, { useState, useRef } from "react";

export default function Dropdown(props) {
    // Option currently selected
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(props.selectedOptionIndex);
    const [isOpen, setIsOpen] = useState(false);
    const buttonDom = useRef(null);
    const ulDom = useRef(null);

    let search = "";
    let lastAlphanumericKeypress = Date.now() - 300;

    const selectPreviousOption = () => {
        setSelectedOptionIndex(prevSelectedOptionIndex => (prevSelectedOptionIndex < 1 ? 0 : prevSelectedOptionIndex - 1));
    };

    const selectNextOption = () => {
        setSelectedOptionIndex(prevSelectedOptionIndex => (prevSelectedOptionIndex >= props.options.length - 1 ? props.options.length - 1 : prevSelectedOptionIndex + 1));
    };

    const handleButtonKeyDown = event => {
        switch (event.keyCode) {
            // enter
            case 13:
                setIsOpen(true);
                ulDom.current.focus();
                break;
            // arrow up
            case 38:
                setIsOpen(true);
                ulDom.current.focus();
                selectPreviousOption();
                break;
            // arrow down
            case 40:
                setIsOpen(true);
                ulDom.current.focus();
                selectNextOption();
                break;
        }
    };

    const filterSearch = () => {
        for (let i = selectedOptionIndex; i < props.options.length; i++) {
            if (props.options[i].toLowerCase().indexOf(search) === 0) {
                setSelectedOptionIndex(i);
                return;
            }
        }
    };

    const handleUlKeyDown = event => {
        switch (event.keyCode) {
            // home
            case 36:
                setSelectedOptionIndex(0);
                break;
            // end
            case 35:
                setSelectedOptionIndex(props.options.length - 1);
                break;
            // arrow up
            case 38:
                selectPreviousOption();
                break;
            // arrow down
            case 40:
                selectNextOption();
                break;
            // enter
            // escape
            case 13:
            case 27:
                setIsOpen(false);
                buttonDom.current.focus();
                break;
            default:
                // if last keypress is over 300ms ago
                if (Date.now() - lastAlphanumericKeypress > 300) {
                    search = "";
                }
                search = search + event.key;
                filterSearch();
                break;
        }
    };

    const handleButtonClick = event => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    };

    const handleLiClick = (event, index) => {
        setSelectedOptionIndex(index);
        setIsOpen(false);
    };

    return (
        <div className={`dropdown ${isOpen ? "dropdown-expanded" : ""}`}>
            <button
                onClick={handleButtonClick}
                onKeyDown={handleButtonKeyDown}
                ref={buttonDom}
                id={props.labelId + "-selected"}
                aria-haspopup="listbox"
                aria-labelledby={`${props.labelId} ${props.labelId}-selected`}
                aria-expanded={isOpen ? "true" : undefined}
            >
                {props.options[selectedOptionIndex]}
            </button>
            <ul onKeyDown={handleUlKeyDown} ref={ulDom} role="listbox" aria-labelledby={props.labelId} tabIndex="-1" aria-activedescendant={`${props.labelId}-${selectedOptionIndex}`}>
                {props.options.map((option, index) => {
                    return (
                        <li
                            id={`${props.labelId}-${index}`}
                            key={`${props.labelId}-${index}`}
                            onClick={event => {
                                handleLiClick(event, index);
                            }}
                            role="option"
                            aria-selected={index === selectedOptionIndex ? "true" : undefined}
                            className={index === selectedOptionIndex ? "dropdown-selected" : undefined}
                        ></li>
                    );
                })}
            </ul>
        </div>
    );
}
