import React, { useState } from "react";
import Slider from "./Slider";
import convert from "color-convert";

const arrayCopyAndReplace = (originalArray, index, newValue) => {
    const newArray = originalArray.concat();
    newArray[index] = newValue;
    return newArray;
};

const getColorDataFromHex = (hex, colorMode) => {
    switch (colorMode) {
        case "RGB":
            return convert.hex.rgb(hex);
        case "HSB":
            return convert.hex.hsv(hex);
        case "HSL":
            return convert.hex.hsl(hex);
        case "CMYK":
            return convert.hex.cmyk(hex);
    }
};

export function HsbModifier(props) {
    const hueSaturated = "#" + convert.hsv.hex(arrayCopyAndReplace(props.color.colorData, 1, 100));
    const hueDesaturated = "#" + convert.hsv.hex(arrayCopyAndReplace(props.color.colorData, 1, 0));
    const hueBright = "#" + convert.hsv.hex(arrayCopyAndReplace(props.color.colorData, 2, 100));

    return (
        <>
            <Slider
                wrapperClass="hue-modifier"
                innerClass="modifier-thumb"
                max={360}
                min={0}
                value={props.color.colorData[0]}
                pageIncrement={10}
                innerLabel="Hue"
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 0, newValue);
                    props.onChange({ hex: "#" + convert.hsv.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="hue-label" aria-hidden="true">
                {Math.round(props.color.colorData[0])}
            </span>
            <Slider
                wrapperClass="saturation-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                value={props.color.colorData[1]}
                pageIncrement={5}
                innerLabel="Saturation"
                style={{ backgroundImage: `linear-gradient(to right, ${hueDesaturated}, ${hueSaturated})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 1, newValue);
                    props.onChange({ hex: "#" + convert.hsv.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="saturation-label" aria-hidden="true">
                {Math.round(props.color.colorData[1])}
            </span>
            <Slider
                wrapperClass="brightness-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                value={props.color.colorData[2]}
                pageIncrement={5}
                innerLabel="Brightness"
                style={{ backgroundImage: `linear-gradient(to right, #000000, ${hueBright})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 2, newValue);
                    props.onChange({ hex: "#" + convert.hsv.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="brightness-label" aria-hidden="true">
                {Math.round(props.color.colorData[2])}
            </span>
        </>
    );
}

export function RgbModifier(props) {
    const redNone = "#" + convert.rgb.hex(arrayCopyAndReplace(props.color.colorData, 0, 0));
    const redFull = "#" + convert.rgb.hex(arrayCopyAndReplace(props.color.colorData, 0, 255));
    const greenNone = "#" + convert.rgb.hex(arrayCopyAndReplace(props.color.colorData, 1, 0));
    const greenFull = "#" + convert.rgb.hex(arrayCopyAndReplace(props.color.colorData, 1, 255));
    const blueNone = "#" + convert.rgb.hex(arrayCopyAndReplace(props.color.colorData, 2, 0));
    const blueFull = "#" + convert.rgb.hex(arrayCopyAndReplace(props.color.colorData, 2, 255));

    return (
        <>
            <Slider
                wrapperClass="red-modifier"
                innerClass="modifier-thumb"
                max={255}
                min={0}
                value={props.color.colorData[0]}
                pageIncrement={10}
                innerLabel="Red"
                style={{ backgroundImage: `linear-gradient(to right, ${redNone}, ${redFull})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 0, newValue);
                    props.onChange({ hex: "#" + convert.rgb.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="red-label" aria-hidden="true">
                {Math.round(props.color.colorData[0])}
            </span>
            <Slider
                wrapperClass="green-modifier"
                innerClass="modifier-thumb"
                max={255}
                min={0}
                value={props.color.colorData[1]}
                pageIncrement={5}
                innerLabel="Green"
                style={{ backgroundImage: `linear-gradient(to right, ${greenNone}, ${greenFull})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 1, newValue);
                    props.onChange({ hex: "#" + convert.rgb.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="green-label" aria-hidden="true">
                {Math.round(props.color.colorData[1])}
            </span>
            <Slider
                wrapperClass="blue-modifier"
                innerClass="modifier-thumb"
                max={255}
                min={0}
                value={props.color.colorData[2]}
                pageIncrement={5}
                innerLabel="Blue"
                style={{ backgroundImage: `linear-gradient(to right, ${blueNone}, ${blueFull})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 2, newValue);
                    props.onChange({ hex: "#" + convert.rgb.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="blue-label" aria-hidden="true">
                {Math.round(props.color.colorData[2])}
            </span>
        </>
    );
}

export function HslModifier(props) {
    const hueSaturated = "#" + convert.hsl.hex(arrayCopyAndReplace(props.color.colorData, 1, 100));
    const hueDesaturated = "#" + convert.hsl.hex(arrayCopyAndReplace(props.color.colorData, 1, 0));
    const hueMediumLightness = "#" + convert.hsl.hex(arrayCopyAndReplace(props.color.colorData, 2, 50));

    return (
        <>
            <Slider
                wrapperClass="hue-modifier"
                innerClass="modifier-thumb"
                max={360}
                min={0}
                value={props.color.colorData[0]}
                pageIncrement={10}
                innerLabel="Hue"
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 0, newValue);
                    props.onChange({ hex: "#" + convert.hsl.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="hue-label" aria-hidden="true">
                {Math.round(props.color.colorData[0])}
            </span>
            <Slider
                wrapperClass="saturation-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                value={props.color.colorData[1]}
                pageIncrement={5}
                innerLabel="Saturation"
                style={{ backgroundImage: `linear-gradient(to right, ${hueDesaturated}, ${hueSaturated})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 1, newValue);
                    props.onChange({ hex: "#" + convert.hsl.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="saturation-label" aria-hidden="true">
                {Math.round(props.color.colorData[1])}
            </span>
            <Slider
                wrapperClass="lightness-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                value={props.color.colorData[2]}
                pageIncrement={5}
                innerLabel="Lightness"
                style={{ backgroundImage: `linear-gradient(to right, #000000, ${hueMediumLightness}, #FFFFFF)` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 2, newValue);
                    props.onChange({ hex: "#" + convert.hsl.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="lightness-label" aria-hidden="true">
                {Math.round(props.color.colorData[2])}
            </span>
        </>
    );
}

export function CmykModifier(props) {
    const cyanNone = "#" + convert.cmyk.hex(arrayCopyAndReplace(props.color.colorData, 0, 0));
    const cyanFull = "#" + convert.cmyk.hex(arrayCopyAndReplace(props.color.colorData, 0, 100));
    const magentaNone = "#" + convert.cmyk.hex(arrayCopyAndReplace(props.color.colorData, 1, 0));
    const magentaFull = "#" + convert.cmyk.hex(arrayCopyAndReplace(props.color.colorData, 1, 100));
    const yellowNone = "#" + convert.cmyk.hex(arrayCopyAndReplace(props.color.colorData, 2, 0));
    const yellowFull = "#" + convert.cmyk.hex(arrayCopyAndReplace(props.color.colorData, 2, 100));
    const keyNone = "#" + convert.cmyk.hex(arrayCopyAndReplace(props.color.colorData, 3, 0));

    return (
        <>
            <Slider
                wrapperClass="cyan-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                value={props.color.colorData[0]}
                pageIncrement={10}
                innerLabel="Cyan"
                style={{ backgroundImage: `linear-gradient(to right, ${cyanNone}, ${cyanFull})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 0, newValue);
                    props.onChange({ hex: "#" + convert.cmyk.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="cyan-label" aria-hidden="true">
                {Math.round(props.color.colorData[0])}
            </span>
            <Slider
                wrapperClass="magenta-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                value={props.color.colorData[1]}
                pageIncrement={5}
                innerLabel="Magenta"
                style={{ backgroundImage: `linear-gradient(to right, ${magentaNone}, ${magentaFull})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 1, newValue);
                    props.onChange({ hex: "#" + convert.cmyk.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="magenta-label" aria-hidden="true">
                {Math.round(props.color.colorData[1])}
            </span>
            <Slider
                wrapperClass="yellow-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                value={props.color.colorData[2]}
                pageIncrement={5}
                innerLabel="Yellow"
                style={{ backgroundImage: `linear-gradient(to right, ${yellowNone}, ${yellowFull})` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 2, newValue);
                    props.onChange({ hex: "#" + convert.cmyk.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="yellow-label" aria-hidden="true">
                {Math.round(props.color.colorData[2])}
            </span>
            <Slider
                wrapperClass="key-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                value={props.color.colorData[3]}
                pageIncrement={5}
                innerLabel="Key"
                style={{ backgroundImage: `linear-gradient(to right, ${keyNone}, #000000)` }}
                onChange={(newValue) => {
                    const newColorData = arrayCopyAndReplace(props.color.colorData, 3, newValue);
                    props.onChange({ hex: "#" + convert.cmyk.hex(newColorData), colorData: newColorData });
                }}
            />
            <span className="key-label" aria-hidden="true">
                {Math.round(props.color.colorData[3])}
            </span>
        </>
    );
}

export default function Swatch(props) {
    const getCorrectModifier = () => {
        switch (props.colorMode) {
            case "RGB":
                return <RgbModifier color={props.color} onChange={props.onChange} />;
            case "HSB":
                return <HsbModifier color={props.color} onChange={props.onChange} />;
            case "HSL":
                return <HslModifier color={props.color} onChange={props.onChange} />;
            case "CMYK":
                return <CmykModifier color={props.color} onChange={props.onChange} />;
        }
    };

    const handleKeyDown = (event) => {
        // If swatch itself is focused and enter is pressed, select it
        if (event.keyCode === 13 && event.target.classList.contains("swatch")) {
            props.onSelect();
        }
    };

    return (
        <div className={`swatch ${props.selected ? "swatch-selected" : ""}`} tabIndex="0" aria-selected={props.selected ? "true" : undefined} style={{ backgroundColor: props.color.hex }} onClick={props.onSelect} onKeyDown={handleKeyDown}>
            <h6>{props.color.hex}</h6>
            {props.deleteButton && (
                <button
                    aria-label="Delete Swatch"
                    onClick={(event) => {
                        event.stopPropagation();
                        props.onDeleteSwatch();
                    }}
                >
                    <img src="/assets/materialicons/material_delete_offblack.svg" alt="" />
                </button>
            )}

            <div className="swatch-modifier">{getCorrectModifier()}</div>
        </div>
    );
}
