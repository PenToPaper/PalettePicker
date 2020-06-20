import React, { useState, useRef, useEffect } from "react";

export default function Dropdown(props) {
    // Option currently selected
    const [isOpen, setIsOpen] = useState(false);
    const buttonDom = useRef(null);
    const ulDom = useRef(null);

    let search = useRef("");
    let lastAlphanumericKeypress = useRef(0);

    useEffect(() => {
        if (isOpen) {
            ulDom.current.focus();
        }
    }, [isOpen]);

    const getSelectedIndex = () => {
        return props.options.indexOf(props.selectedOption);
    };

    const setSelectedOption = (index) => {
        props.onChange(props.options[index]);
    };

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
                event.preventDefault();
                break;
            // arrow up
            case 38:
                setIsOpen(true);
                selectPreviousOption();
                event.preventDefault();
                break;
            // arrow down
            case 40:
                setIsOpen(true);
                selectNextOption();
                event.preventDefault();
                break;
        }
    };

    const filterSearch = (searchChars) => {
        // filter results based on currently selected item
        for (let i = getSelectedIndex(); i < props.options.length; i++) {
            if (props.options[i].toLowerCase().indexOf(searchChars) === 0) {
                setSelectedOption(i);
                return;
            }
        }

        // if it finds nothing, search the first half of the list
        for (let i = 0; i < getSelectedIndex(); i++) {
            if (props.options[i].toLowerCase().indexOf(searchChars) === 0) {
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
                event.preventDefault();
                break;
            // end
            case 35:
                setSelectedOption(props.options.length - 1);
                event.preventDefault();
                break;
            // arrow up
            case 38:
                selectPreviousOption();
                event.preventDefault();
                break;
            // arrow down
            case 40:
                selectNextOption();
                event.preventDefault();
                break;
            // enter
            // escape
            case 13:
            case 27:
                setIsOpen(false);
                buttonDom.current.focus();
                event.preventDefault();
                break;
            default:
                // if last keypress is over 300ms ago
                const currentTimestamp = Date.now();
                const keyPressed = event.key.concat();
                if (search.current !== "" && currentTimestamp - lastAlphanumericKeypress.current > 500) {
                    search.current = keyPressed;
                } else {
                    search.current = search.current + keyPressed;
                }
                lastAlphanumericKeypress.current = currentTimestamp;
                filterSearch(search.current);
                break;
        }
    };

    const handleButtonClick = (event) => {
        setIsOpen(true);
    };

    const handleLiClick = (event, index) => {
        setSelectedOption(index);
        setIsOpen(false);
        buttonDom.current.focus();
    };

    const handleBlur = (event) => {
        setIsOpen(false);
    };

    return (
        <div className={`dropdown ${isOpen ? "dropdown-expanded" : ""}`}>
            <button
                onMouseDown={handleButtonClick}
                onKeyDown={handleButtonKeyDown}
                ref={buttonDom}
                id={props.labelId + "-selected"}
                aria-haspopup="listbox"
                aria-labelledby={`${props.labelId} ${props.labelId}-selected`}
                aria-expanded={isOpen ? "true" : undefined}
            >
                {props.selectedOption}
            </button>
            <ul onKeyDown={handleUlKeyDown} ref={ulDom} role="listbox" aria-labelledby={props.labelId} tabIndex="-1" aria-activedescendant={`${props.labelId}-${getSelectedIndex()}`} onBlur={handleBlur}>
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
