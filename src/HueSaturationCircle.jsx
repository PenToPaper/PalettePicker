import React, { useState, useEffect } from "react";
import HueSaturationNode from "./HueSaturationNode";
import { getCoordinateFromHueSaturation } from "./HueSaturationNode";
import convert from "color-convert";

export function getOffsetFromCenter(radius, xOffset, yOffset) {
    return [xOffset - radius, radius - yOffset];
}

export function getHue(radius, xOffset, yOffset) {
    // Math.atan finds degree of hue in radians, Math.round * 180/Math.PI converts this to degrees
    let triangleAngle = (Math.atan(yOffset / xOffset) * 180) / Math.PI;
    let ret = triangleAngle;
    if (xOffset >= 0) {
        if (yOffset <= 0) {
            // Q4
            ret = triangleAngle + 360;
        }
    } else if (xOffset < 0) {
        ret = triangleAngle + 180;
    }
    return Math.round(ret);
}

export function getSaturation(radius, xOffset, yOffset) {
    // Inner uses a^2 + b^2 = c^2 to get the hypotenuse of the triangle using the length of the 2 sides
    // Hypotenuse multiplied by 100 to get the final percent value from between 0 and 1 to between 0 and 100
    // Rounded
    // Math.min ensures clicks outside of the circle but within the box are counted as at most 100 saturation2
    return Math.min(Math.round((Math.sqrt(xOffset * xOffset + yOffset * yOffset) * 100) / radius), 100);
}

export default function HueSaturationCircle(props) {
    const [circleRadius, setCircleRadius] = useState(0);
    let instance = null;

    const setStartSize = (element) => {
        if (element) {
            setCircleRadius(element.getBoundingClientRect().width / 2);
            instance = element;
        }
    };

    const refreshSize = () => {
        if (instance !== null) {
            setCircleRadius(instance.getBoundingClientRect().width / 2);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", refreshSize);

        return () => {
            window.removeEventListener("resize", refreshSize);
        };
    }, [refreshSize]);

    const dragSelection = Object.assign({}, props.selection);

    const handleDrag = (x, y) => {
        props.onPickColor(getHue(circleRadius, ...getOffsetFromCenter(circleRadius, x, y)), getSaturation(circleRadius, ...getOffsetFromCenter(circleRadius, x, y)), dragSelection);
    };

    const coordinatesAreWithin = (x, y, x1, y1, distance) => {
        return Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2)) <= distance;
    };

    const startDrag = (x, y) => {
        dragSelection.sectionName = props.selection.sectionName;
        dragSelection.index = props.selection.index;

        for (let swatchCategory of Object.keys(props.swatches)) {
            for (let swatchKey of Object.keys(props.swatches[swatchCategory])) {
                const [hue, saturation, brightness] = convert.hex.hsv(props.swatches[swatchCategory][swatchKey].hex);
                const coordinates = getCoordinateFromHueSaturation(circleRadius, hue, saturation);
                if (coordinatesAreWithin(...getOffsetFromCenter(circleRadius, x, y), ...coordinates, 25)) {
                    dragSelection.sectionName = swatchCategory;
                    dragSelection.index = swatchKey;
                    props.onSelectSwatch({ sectionName: swatchCategory, index: swatchKey });
                    return;
                }
            }
        }
    };

    const handleMouseUp = (event) => {
        const x = event.clientX - instance.getBoundingClientRect().left;
        const y = event.clientY - instance.getBoundingClientRect().top;

        handleDrag(x, y);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event) => {
        const x = event.clientX - instance.getBoundingClientRect().left;
        const y = event.clientY - instance.getBoundingClientRect().top;

        handleDrag(x, y);
    };

    const handleMouseDown = (event) => {
        const x = event.clientX - instance.getBoundingClientRect().left;
        const y = event.clientY - instance.getBoundingClientRect().top;

        startDrag(x, y);
        handleDrag(x, y);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleTouchMove = (event) => {
        event.preventDefault();
        const x = event.pageX - instance.getBoundingClientRect().left - window.scrollX;
        const y = event.pageY - instance.getBoundingClientRect().top - window.scrollY;

        handleDrag(x, y);
    };

    const handleTouchEnd = (event) => {
        const x = event.pageX - instance.getBoundingClientRect().left - window.scrollX;
        const y = event.pageY - instance.getBoundingClientRect().top - window.scrollY;

        handleDrag(x, y);

        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
    };

    const handleTouchStart = (event) => {
        // TODO: Verify that the event listeners are properly disposed of when touch ends
        event.preventDefault();

        const x = event.touches[0].pageX - instance.getBoundingClientRect().left - window.scrollX;
        const y = event.touches[0].pageY - instance.getBoundingClientRect().top - window.scrollY;

        startDrag(x, y);
        handleDrag(x, y);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
    };

    return (
        <div className="hue-saturation-circle" ref={setStartSize} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} aria-hidden="true">
            {Object.keys(props.swatches).map((swatchCategory) => {
                return Object.keys(props.swatches[swatchCategory])
                    .reverse()
                    .map((swatchKey) => {
                        return (
                            <HueSaturationNode
                                colorMode={props.colorMode}
                                key={`${swatchCategory}-${swatchKey}`}
                                selected={swatchCategory === props.selection.sectionName && swatchKey === props.selection.index}
                                circleRadius={circleRadius}
                                color={props.swatches[swatchCategory][swatchKey]}
                            />
                        );
                    });
            })}
        </div>
    );
}
