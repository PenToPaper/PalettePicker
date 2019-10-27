import React from "react";
import Slider from "./Slider";
import convert from "color-convert";

export default function Swatch(props) {
    const onChangeToHexWrapper = (newValue, colorIndex, prevColorArray, colorMode) => {
        // Duplicates array, replaces array[colorIndex] with newValue
        const newColorArray = prevColorArray.concat();
        newColorArray[colorIndex] = newValue;

        // Converts hsb which I like to hsv which color-convert likes
        if (colorMode === "hsb") {
            colorMode = "hsv";
        }

        // Calls props.onColorChange callback with new color, formatted with # prefix, returns new color as well
        const newColorHex = "#" + convert[colorMode].hex(newColorArray);
        props.onColorChange(newColorHex);
        return newColorHex;
    };

    const getRgbModifier = () => {
        const rgb = convert.hex.rgb(props.color);
        return (
            <>
                <Slider
                    wrapperClass="red-modifier"
                    innerClass="modifier-thumb"
                    max={255}
                    min={0}
                    default={rgb[0]}
                    pageIncrement={5}
                    innerLabel="Red"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 0, rgb, "rgb");
                    }}
                />
                <span className="hue-label" aria-hidden="true">
                    {rgb[0]}
                </span>
                <Slider
                    wrapperClass="green-modifier"
                    innerClass="modifier-thumb"
                    max={255}
                    min={0}
                    default={rgb[1]}
                    pageIncrement={5}
                    innerLabel="Green"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 1, rgb, "rgb");
                    }}
                />
                <span className="saturation-label" aria-hidden="true">
                    {rgb[1]}
                </span>
                <Slider
                    wrapperClass="blue-modifier"
                    innerClass="modifier-thumb"
                    max={255}
                    min={0}
                    default={rgb[2]}
                    pageIncrement={5}
                    innerLabel="Blue"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 2, rgb, "rgb");
                    }}
                />
                <span className="brightness-label" aria-hidden="true">
                    {rgb[2]}
                </span>
            </>
        );
    };

    const getHsbModifier = () => {
        const hsb = convert.hex.hsv(props.color);
        return (
            <>
                <Slider
                    wrapperClass="hue-modifier"
                    innerClass="modifier-thumb"
                    max={360}
                    min={0}
                    default={hsb[0]}
                    pageIncrement={10}
                    innerLabel="Hue"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 0, hsb, "hsb");
                    }}
                />
                <span className="hue-label" aria-hidden="true">
                    {hsb[0]}
                </span>
                <Slider
                    wrapperClass="saturation-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    default={hsb[1]}
                    pageIncrement={5}
                    innerLabel="Saturation"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 1, hsb, "hsb");
                    }}
                />
                <span className="saturation-label" aria-hidden="true">
                    {hsb[1]}
                </span>
                <Slider
                    wrapperClass="brightness-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    default={hsb[2]}
                    pageIncrement={5}
                    innerLabel="Brightness"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 2, hsb, "hsb");
                    }}
                />
                <span className="brightness-label" aria-hidden="true">
                    {hsb[2]}
                </span>
            </>
        );
    };

    const getHslModifier = () => {
        const hsl = convert.hex.hsl(props.color);
        return (
            <>
                <Slider
                    wrapperClass="hue-modifier"
                    innerClass="modifier-thumb"
                    max={360}
                    min={0}
                    default={hsl[0]}
                    pageIncrement={10}
                    innerLabel="Hue"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 0, hsl, "hsl");
                    }}
                />
                <span className="hue-label" aria-hidden="true">
                    {hsl[0]}
                </span>
                <Slider
                    wrapperClass="saturation-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    default={hsl[1]}
                    pageIncrement={5}
                    innerLabel="Saturation"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 1, hsl, "hsl");
                    }}
                />
                <span className="saturation-label" aria-hidden="true">
                    {hsl[1]}
                </span>
                <Slider
                    wrapperClass="lightness-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    default={hsl[2]}
                    pageIncrement={5}
                    innerLabel="Lightness"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 2, hsl, "hsl");
                    }}
                />
                <span className="brightness-label" aria-hidden="true">
                    {hsl[2]}
                </span>
            </>
        );
    };

    const getCmykModifier = () => {
        const cmyk = convert.hex.cmyk(props.color);
        return (
            <>
                <Slider
                    wrapperClass="cyan-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    default={cmyk[0]}
                    pageIncrement={10}
                    innerLabel="Cyan"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 0, cmyk, "cmyk");
                    }}
                />
                <span className="cyan-label" aria-hidden="true">
                    {cmyk[0]}
                </span>
                <Slider
                    wrapperClass="magenta-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    default={cmyk[1]}
                    pageIncrement={5}
                    innerLabel="Magenta"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 1, cmyk, "cmyk");
                    }}
                />
                <span className="magenta-label" aria-hidden="true">
                    {cmyk[1]}
                </span>
                <Slider
                    wrapperClass="yellow-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    default={cmyk[2]}
                    pageIncrement={5}
                    innerLabel="Yellow"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 2, cmyk, "cmyk");
                    }}
                />
                <span className="yellow-label" aria-hidden="true">
                    {cmyk[2]}
                </span>
                <Slider
                    wrapperClass="black-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    default={cmyk[3]}
                    pageIncrement={5}
                    innerLabel="Key"
                    onChange={newValue => {
                        onChangeToHexWrapper(newValue, 3, cmyk, "cmyk");
                    }}
                />
                <span className="black-label" aria-hidden="true">
                    {cmyk[3]}
                </span>
            </>
        );
    };

    const getCorrectModifier = () => {
        switch (props.colorMode) {
            case "rgb":
                return getRgbModifier();
            case "hsb":
                return getHsbModifier();
            case "hsl":
                return getHslModifier();
            case "cmyk":
                return getCmykModifier();
        }
    };

    return (
        <div className="swatch" tabIndex="0" aria-selected={props.selected ? "true" : undefined} style={{ backgroundColor: props.color }} onClick={props.onSelect}>
            <h6>{props.color}</h6>
            {props.deleteButton && (
                <button
                    aria-label="Delete Swatch"
                    onClick={event => {
                        event.stopPropagation();
                        props.onDeleteSwatch(event);
                    }}
                >
                    <img src="/assets/materialicons/material_delete_offblack.svg" alt="" />
                </button>
            )}

            <div className="swatch-modifier">{getCorrectModifier()}</div>
        </div>
    );
}
