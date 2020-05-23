import React, { useState, useRef } from "react";

export default function Dropdown(props) {
    // Option currently selected
    const [isOpen, setIsOpen] = useState(false);
    const buttonDom = useRef(null);
    const ulDom = useRef(null);

    const getSelectedIndex = () => {
        props.options.indexOf(props.selectedOption);
    };

    const setSelectedOption = (index) => {
        props.onChange(props.options[index]);
    };

    let search = "";
    let lastAlphanumericKeypress = Date.now() - 300;

    const selectPreviousOption = () => {
        setSelectedOption(getSelectedIndex() < 1 ? 0 : getSelectedIndex() - 1);
    };

    const selectNextOption = () => {
        setSelectedOption(getSelectedIndex() >= props.options.length - 1 ? props.options.length - 1 : getSelectedIndex() + 1);
    };

    const handleButtonKeyDown = (event) => {
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
        for (let i = getSelectedIndex(); i < props.options.length; i++) {
            if (props.options[i].toLowerCase().indexOf(search) === 0) {
                setSelectedOption(i);
                return;
            }
        }
    };

    const handleUlKeyDown = (event) => {
        switch (event.keyCode) {
            // home
            case 36:
                setSelectedOption(0);
                break;
            // end
            case 35:
                setSelectedOption(props.options.length - 1);
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

    const handleButtonClick = (event) => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    const handleLiClick = (event, index) => {
        setSelectedOption(index);
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
                {props.selectedOption}
            </button>
            <ul onKeyDown={handleUlKeyDown} ref={ulDom} role="listbox" aria-labelledby={props.labelId} tabIndex="-1" aria-activedescendant={`${props.labelId}-${getSelectedIndex()}`}>
                {props.options.map((option, index) => {
                    return (
                        <li
                            id={`${props.labelId}-${index}`}
                            key={`${props.labelId}-${index}`}
                            onClick={(event) => {
                                handleLiClick(event, index);
                            }}
                            role="option"
                            aria-selected={option === props.selectedOption ? "true" : undefined}
                            className={option === props.selectedOption ? "dropdown-selected" : undefined}
                        >
                            {option}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
