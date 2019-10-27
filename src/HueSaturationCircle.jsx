import React, { useState } from "react";
import HueSaturationNode from "./HueSaturationNode";

export function getOffsetFromCenter(radius, xOffset, yOffset) {
    return [xOffset - radius, radius - yOffset];
}

export function getHue(radius, xOffset, yOffset) {
    // Math.atan finds degree of hue in radians, Math.round * 180/Math.PI converts this to degrees
    return Math.round((Math.atan(yOffset / xOffset) * 180) / Math.PI);
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
    const updateSize = element => {
        if (element) {
            setCircleRadius(element.getBoundingClientRect().width / 2);
        }
    };

    const handleClick = event => {
        const x = event.nativeEvent.offsetX,
            y = event.nativeEvent.offsetY;
        props.onPickColor(getHue(circleRadius, ...getOffsetFromCenter(circleRadius, x, y)), getSaturation(circleRadius, ...getOffsetFromCenter(circleRadius, x, y)));
    };

    return (
        <div className="hue-saturation-circle" ref={updateSize} onClick={handleClick} aria-hidden="true">
            {Object.keys(props.swatches).map(swatchCategory => {
                return Object.keys(props.swatches[swatchCategory]).map(swatchKey => {
                    return <HueSaturationNode key={`${swatchCategory}-${swatchKey}`} circleRadius={circleRadius} color={props.swatches[swatchCategory][swatchKey]} />;
                });
            })}
        </div>
    );
}
