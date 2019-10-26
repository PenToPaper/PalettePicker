import React, { useState, useRef } from "react";

export default function Slider(props) {
    const [value, setValue] = useState(props.default);
    const containerDom = useRef(null);

    const setAndUpdateValue = newValue => {
        setValue(newValue);
        props.onChange(newValue);
    };

    const getElementWidth = () => {
        return containerDom.current ? containerDom.current.offsetWidth : 0;
    };

    const getSliderOffsetPx = () => {
        return String((value / (props.max - props.min)) * getElementWidth()) + "px";
    };

    const incrementValue = incrementBy => {
        if (value + incrementBy <= props.max) {
            setAndUpdateValue(value + incrementBy);
        } else if (value !== props.max) {
            setAndUpdateValue(props.max);
        }
    };

    const decrementValue = decrementBy => {
        if (value - decrementBy >= props.min) {
            setAndUpdateValue(value - decrementBy);
        } else if (value !== props.min) {
            setAndUpdateValue(props.min);
        }
    };

    const handleKeyDown = event => {
        switch (event.keyCode) {
            // home
            case 36:
                setAndUpdateValue(props.min);
                break;
            // end
            case 35:
                setAndUpdateValue(props.max);
                break;
            // arrow up
            case 38:
                incrementValue(1);
                break;
            // arrow down
            case 40:
                decrementValue(1);
                break;
            // arrow left
            case 37:
                decrementValue(1);
                break;
            // arrow right
            case 39:
                incrementValue(1);
                break;
            // page up
            case 33:
                incrementValue(props.pageIncrement);
                break;
            // page down
            case 34:
                decrementValue(props.pageIncrement);
                break;
        }
    };

    const handleMouseUp = event => {
        handleDrag(event);

        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleDrag = event => {
        const newValue = ((event.clientX - containerDom.current ? containerDom.current.getBoundingClientRect().left : 0) / getElementWidth()) * props.max;
        setAndUpdateValue(newValue);
    };

    const handleStartDrag = event => {
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className={props.wrapperClass} ref={containerDom} onMouseDown={handleStartDrag}>
            <div
                onKeyDown={handleKeyDown}
                style={{ left: getSliderOffsetPx() }}
                className={props.innerClass}
                role="slider"
                tabIndex="0"
                aria-valuemax={String(props.max)}
                aria-valuemin={String(props.min)}
                aria-valuenow={String(value)}
                aria-label={props.innerLabel}
            ></div>
        </div>
    );
}
