import React from "react";
import convert from "color-convert";

// If circle was a coordinate plane, with 0, 0 as the center
export function getCoordinateFromHueSaturation(circleRadius, hue, saturation) {
    const degreesToRadians = degrees => {
        return (degrees * Math.PI) / 180;
    };

    return [Math.round(((saturation * Math.cos(degreesToRadians(hue))) / 100) * circleRadius), Math.round(((saturation * Math.sin(degreesToRadians(hue))) / 100) * circleRadius)];
}

export default function HueSaturationNode(props) {
    const [hue, saturation, brightness] = convert.hex.hsv(props.color);
    const coordinates = getCoordinateFromHueSaturation(props.circleRadius, hue, saturation);
    return <div className="hue-saturation-node" style={{ left: `${props.circleRadius + coordinates[0]}px`, top: `${props.circleRadius - coordinates[1]}px` }} />;
}