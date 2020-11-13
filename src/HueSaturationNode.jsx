import React from "react";
import convert from "color-convert";

// If circle was a coordinate plane, with 0, 0 as the center
export function getCoordinateFromHueSaturation(circleRadius, hue, saturation) {
    const degreesToRadians = (degrees) => {
        return (degrees * Math.PI) / 180;
    };

    return [Math.round(((saturation * Math.cos(degreesToRadians(hue))) / 100) * circleRadius), Math.round(((saturation * Math.sin(degreesToRadians(hue))) / 100) * circleRadius)];
}

export default function HueSaturationNode(props) {
    const [hue, saturation] = convert.hex.hsv(props.color.hex);
    let coordinates;
    // More accurate representation if colorMode is already HSB
    if (props.colorMode === "HSB") {
        coordinates = getCoordinateFromHueSaturation(props.circleRadius, props.color.colorData[0], props.color.colorData[1]);
    } else {
        coordinates = getCoordinateFromHueSaturation(props.circleRadius, hue, saturation);
    }
    return (
        <div className={props.selected ? "hue-saturation-node node-selected" : "hue-saturation-node"} style={{ left: `${props.circleRadius + coordinates[0]}px`, top: `${props.circleRadius - coordinates[1]}px`, backgroundColor: props.color.hex }} />
    );
}
