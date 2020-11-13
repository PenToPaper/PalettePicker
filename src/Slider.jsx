import React, { useRef } from "react";

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
    const containerDom = useRef(null);
    const innerDom = useRef(null);

    const incrementValue = (incrementBy) => {
        props.onChange((props.value + incrementBy) % props.max);
    };

    const decrementValue = (decrementBy) => {
        props.onChange((props.value - decrementBy + props.max) % props.max);
    };

    const handleKeyDown = (event) => {
        switch (event.keyCode) {
            // home
            case 36:
                event.preventDefault();
                props.onChange(props.min);
                break;
            // end
            case 35:
                event.preventDefault();
                props.onChange(props.max);
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
            default:
                return;
        }
    };

    const handleDrag = (x) => {
        props.onChange(getPercentFilled(containerDom.current ? containerDom.current.getBoundingClientRect().width : 0, x) * props.max);
    };

    const handleMouseUp = (event) => {
        const x = event.clientX - containerDom.current.getBoundingClientRect().left;

        handleDrag(x);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        innerDom.current.focus();
    };

    const handleMouseMove = (event) => {
        const x = event.clientX - containerDom.current.getBoundingClientRect().left;

        handleDrag(x);
    };

    const handleMouseDown = (event) => {
        const x = event.clientX - containerDom.current.getBoundingClientRect().left;

        handleDrag(x);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        innerDom.current.focus();
    };

    const handleTouchMove = (event) => {
        event.preventDefault();
        const x = event.pageX - containerDom.current.getBoundingClientRect().left - window.scrollX;

        handleDrag(x);
    };

    const handleTouchEnd = (event) => {
        const x = event.pageX - containerDom.current.getBoundingClientRect().left - window.scrollX;

        handleDrag(x);

        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);

        innerDom.current.focus();
    };

    const handleTouchStart = (event) => {
        event.preventDefault();

        const x = event.touches[0].pageX - containerDom.current.getBoundingClientRect().left - window.scrollX;

        handleDrag(x);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        innerDom.current.focus();
    };

    return (
        <div className={props.wrapperClass} ref={containerDom} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} style={props.style}>
            <div
                ref={innerDom}
                onKeyDown={handleKeyDown}
                style={{ ...props.innerStyle, left: (props.value / props.max) * 100 + "%" }}
                className={props.innerClass}
                role="slider"
                tabIndex="0"
                aria-valuemax={String(props.max)}
                aria-valuemin={String(props.min)}
                aria-valuenow={String(Math.round(props.value))}
                aria-label={props.innerLabel}
            ></div>
        </div>
    );
}
