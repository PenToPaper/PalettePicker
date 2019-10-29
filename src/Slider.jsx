import React, { useState, useRef } from "react";

export function getPercentFilled(sliderWidth, relativeMouseX) {
    let percentNum = relativeMouseX / sliderWidth;
    if (percentNum > 1) {
        percentNum = 1;
    } else if (percentNum < 0) {
        percentNum = 0;
    }
    return percentNum;
}

export default function Slider(props) {
    const [value, setValue] = useState(props.default);
    const containerDom = useRef(null);

    const getRelativeMouseX = absoluteMouseX => {
        return containerDom.current ? absoluteMouseX - containerDom.current.getBoundingClientRect().left : 0;
    };

    const setAndUpdateValue = newValue => {
        setValue(newValue);
        props.onChange(newValue);
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
                event.preventDefault();
                setAndUpdateValue(props.min);
                break;
            // end
            case 35:
                event.preventDefault();
                setAndUpdateValue(props.max);
                break;
            // arrow up
            case 38:
                event.preventDefault();
                incrementValue(1);
                break;
            // arrow down
            case 40:
                event.preventDefault();
                decrementValue(1);
                break;
            // arrow left
            case 37:
                event.preventDefault();
                decrementValue(1);
                break;
            // arrow right
            case 39:
                event.preventDefault();
                incrementValue(1);
                break;
            // page up
            case 33:
                event.preventDefault();
                incrementValue(props.pageIncrement);
                break;
            // page down
            case 34:
                event.preventDefault();
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
        setAndUpdateValue(getPercentFilled(containerDom.current ? containerDom.current.getBoundingClientRect().width : 0, getRelativeMouseX(event.clientX)) * props.max);
    };

    const handleStartDrag = event => {
        handleDrag(event);
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className={props.wrapperClass} ref={containerDom} onMouseDown={handleStartDrag} style={props.style}>
            <div
                onKeyDown={handleKeyDown}
                style={{ left: (value / props.max) * 100 + "%" }}
                className={props.innerClass}
                role="slider"
                tabIndex="0"
                aria-valuemax={String(props.max)}
                aria-valuemin={String(props.min)}
                aria-valuenow={String(Math.round(value))}
                aria-label={props.innerLabel}
            ></div>
        </div>
    );
}
