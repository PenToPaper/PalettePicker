import React, { useState, useRef } from "react";

export function getPercentFilled(sliderHeight, relativeMouseY) {
    let percentNum = Math.round((relativeMouseY / sliderHeight) * 10000) / 100;
    if (percentNum > 100) {
        percentNum = 100;
    } else if (percentNum < 0) {
        percentNum = 0;
    }
    return percentNum + "%";
}

export default function VerticalSlider(props) {
    const [percentFilled, setPercentFilled] = useState("0%");
    const containerDom = useRef(null);

    const getRelativeMouseY = absoluteMouseY => {
        return containerDom.current ? absoluteMouseY - containerDom.current.getBoundingClientRect().top : 0;
    };

    const setAndUpdateValue = newValue => {
        setPercentFilled(newValue);
        props.onChange(newValue);
    };

    const handleMouseUp = event => {
        handleDrag(event);

        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleDrag = event => {
        setAndUpdateValue(getPercentFilled(containerDom.current ? containerDom.current.getBoundingClientRect().height : 0, getRelativeMouseY(event.clientY)));
    };

    const handleStartDrag = event => {
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div ref={containerDom} className={props.divClass} onMouseDown={handleStartDrag}>
            <div className={props.thumbClass} style={{ top: percentFilled }} />
        </div>
    );
}
