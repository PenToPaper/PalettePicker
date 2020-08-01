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

    const handleDrag = (y) => {
        props.onChange(getPercentFilled(containerDom.current ? containerDom.current.getBoundingClientRect().height : 0, y) * 100);
    };

    const handleMouseUp = (event) => {
        const y = event.clientY - containerDom.current.getBoundingClientRect().top;

        handleDrag(y);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event) => {
        const y = event.clientY - containerDom.current.getBoundingClientRect().top;

        handleDrag(y);
    };

    const handleMouseDown = (event) => {
        const y = event.clientY - containerDom.current.getBoundingClientRect().top;

        handleDrag(y);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleTouchMove = (event) => {
        event.preventDefault();
        const y = event.pageY - containerDom.current.getBoundingClientRect().top - window.scrollY;

        handleDrag(y);
    };

    const handleTouchEnd = (event) => {
        const y = event.pageY - containerDom.current.getBoundingClientRect().top - window.scrollY;

        handleDrag(y);

        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
    };

    const handleTouchStart = (event) => {
        // TODO: Verify that the event listeners are properly disposed of when touch ends
        event.preventDefault();

        const y = event.touches[0].pageY - containerDom.current.getBoundingClientRect().top - window.scrollY;

        handleDrag(y);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
    };

    return (
        <div ref={containerDom} style={props.style} className={props.divClass} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
            <div className={props.thumbClass} style={{ ...props.innerStyle, top: props.value + "%" }} />
        </div>
    );
}
