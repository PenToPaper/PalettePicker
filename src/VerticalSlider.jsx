import React, { useRef } from "react";

export function getPercentFilled(sliderHeight, relativeMouseY) {
    let percentNum = relativeMouseY / sliderHeight;
    if (percentNum > 1) {
        percentNum = 1;
    } else if (percentNum < 0) {
        percentNum = 0;
    }
    return percentNum;
}

export default function VerticalSlider(props) {
    const containerDom = useRef(null);

    const getRelativeMouseY = (absoluteMouseY) => {
        return containerDom.current ? absoluteMouseY - containerDom.current.getBoundingClientRect().top : 0;
    };

    const handleMouseUp = (event) => {
        handleDrag(event);

        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleDrag = (event) => {
        props.onChange(getPercentFilled(containerDom.current ? containerDom.current.getBoundingClientRect().height : 0, getRelativeMouseY(event.clientY)) * 100);
    };

    const handleStartDrag = (event) => {
        handleDrag(event);
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div ref={containerDom} style={props.style} className={props.divClass} onMouseDown={handleStartDrag}>
            <div className={props.thumbClass} style={{ ...props.innerStyle, top: props.value + "%" }} />
        </div>
    );
}
