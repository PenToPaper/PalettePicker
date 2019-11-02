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
    const realHsb = convert.hex.hsv(props.color);
    const [userFriendlyHsb, setUserFriendlyHsb] = useState(getColorDataFromHex(props.color, "HSB"));

    const hueSaturated = "#" + convert.hsv.hex(arrayCopyAndReplace(userFriendlyHsb, 1, 100));
    const hueDesaturated = "#" + convert.hsv.hex(arrayCopyAndReplace(userFriendlyHsb, 1, 0));
    const hueBright = "#" + convert.hsv.hex(arrayCopyAndReplace(userFriendlyHsb, 2, 100));

    return (
        <>
            <Slider
                wrapperClass="hue-modifier"
                innerClass="modifier-thumb"
                max={360}
                min={0}
                default={userFriendlyHsb[0]}
                pageIncrement={10}
                innerLabel="Hue"
                onChange={newValue => {
                    setUserFriendlyHsb(prevUserFriendlyHsb => {
                        prevUserFriendlyHsb[0] = newValue;
                        props.onChange("#" + convert.hsv.hex(prevUserFriendlyHsb));
                        return prevUserFriendlyHsb;
                    });
                }}
            />
            <span className="hue-label" aria-hidden="true">
                {realHsb[0]}
            </span>
            <Slider
                wrapperClass="saturation-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                default={userFriendlyHsb[1]}
                pageIncrement={5}
                innerLabel="Saturation"
                style={{ backgroundImage: `linear-gradient(to right, ${hueDesaturated}, ${hueSaturated})` }}
                onChange={newValue => {
                    setUserFriendlyHsb(prevUserFriendlyHsb => {
                        prevUserFriendlyHsb[1] = newValue;
                        props.onChange("#" + convert.hsv.hex(prevUserFriendlyHsb));
                        return prevUserFriendlyHsb;
                    });
                }}
            />
            <span className="saturation-label" aria-hidden="true">
                {realHsb[1]}
            </span>
            <Slider
                wrapperClass="brightness-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                default={userFriendlyHsb[2]}
                pageIncrement={5}
                innerLabel="Brightness"
                style={{ backgroundImage: `linear-gradient(to right, #000000, ${hueBright})` }}
                onChange={newValue => {
                    setUserFriendlyHsb(prevUserFriendlyHsb => {
                        prevUserFriendlyHsb[2] = newValue;
                        props.onChange("#" + convert.hsv.hex(prevUserFriendlyHsb));
                        return prevUserFriendlyHsb;
                    });
                }}
            />
            <span className="brightness-label" aria-hidden="true">
                {realHsb[2]}
            </span>
        </>
    );
}

export function RgbModifier(props) {
    const realRgb = convert.hex.rgb(props.color);
    const [userFriendlyRgb, setUserFriendlyRgb] = useState(getColorDataFromHex(props.color, "RGB"));

    const redNone = "#" + convert.rgb.hex(arrayCopyAndReplace(userFriendlyRgb, 0, 0));
    const redFull = "#" + convert.rgb.hex(arrayCopyAndReplace(userFriendlyRgb, 0, 255));
    const greenNone = "#" + convert.rgb.hex(arrayCopyAndReplace(userFriendlyRgb, 1, 0));
    const greenFull = "#" + convert.rgb.hex(arrayCopyAndReplace(userFriendlyRgb, 1, 255));
    const blueNone = "#" + convert.rgb.hex(arrayCopyAndReplace(userFriendlyRgb, 2, 0));
    const blueFull = "#" + convert.rgb.hex(arrayCopyAndReplace(userFriendlyRgb, 2, 255));

    return (
        <>
            <Slider
                wrapperClass="red-modifier"
                innerClass="modifier-thumb"
                max={255}
                min={0}
                default={userFriendlyRgb[0]}
                pageIncrement={10}
                innerLabel="Red"
                style={{ backgroundImage: `linear-gradient(to right, ${redNone}, ${redFull})` }}
                onChange={newValue => {
                    setUserFriendlyRgb(prevUserFriendlyRgb => {
                        prevUserFriendlyRgb[0] = newValue;
                        props.onChange("#" + convert.rgb.hex(prevUserFriendlyRgb));
                        return prevUserFriendlyRgb;
                    });
                }}
            />
            <span className="red-label" aria-hidden="true">
                {realRgb[0]}
            </span>
            <Slider
                wrapperClass="green-modifier"
                innerClass="modifier-thumb"
                max={255}
                min={0}
                default={userFriendlyRgb[1]}
                pageIncrement={5}
                innerLabel="Green"
                style={{ backgroundImage: `linear-gradient(to right, ${greenNone}, ${greenFull})` }}
                onChange={newValue => {
                    setUserFriendlyRgb(prevUserFriendlyRgb => {
                        prevUserFriendlyRgb[1] = newValue;
                        props.onChange("#" + convert.rgb.hex(prevUserFriendlyRgb));
                        return prevUserFriendlyRgb;
                    });
                }}
            />
            <span className="green-label" aria-hidden="true">
                {realRgb[1]}
            </span>
            <Slider
                wrapperClass="blue-modifier"
                innerClass="modifier-thumb"
                max={255}
                min={0}
                default={userFriendlyRgb[2]}
                pageIncrement={5}
                innerLabel="Blue"
                style={{ backgroundImage: `linear-gradient(to right, ${blueNone}, ${blueFull})` }}
                onChange={newValue => {
                    setUserFriendlyRgb(prevUserFriendlyRgb => {
                        prevUserFriendlyRgb[2] = newValue;
                        props.onChange("#" + convert.rgb.hex(prevUserFriendlyRgb));
                        return prevUserFriendlyRgb;
                    });
                }}
            />
            <span className="blue-label" aria-hidden="true">
                {realRgb[2]}
            </span>
        </>
    );
}

export function HslModifier(props) {
    const realHsl = convert.hex.hsl(props.color);
    const [userFriendlyHsl, setUserFriendlyHsl] = useState(getColorDataFromHex(props.color, "HSL"));

    const hueSaturated = "#" + convert.hsl.hex(arrayCopyAndReplace(userFriendlyHsl, 1, 100));
    const hueDesaturated = "#" + convert.hsl.hex(arrayCopyAndReplace(userFriendlyHsl, 1, 0));
    const hueMediumLightness = "#" + convert.hsl.hex(arrayCopyAndReplace(userFriendlyHsl, 2, 50));

    return (
        <>
            <Slider
                wrapperClass="hue-modifier"
                innerClass="modifier-thumb"
                max={360}
                min={0}
                default={userFriendlyHsl[0]}
                pageIncrement={10}
                innerLabel="Hue"
                onChange={newValue => {
                    setUserFriendlyHsl(prevUserFriendlyHsl => {
                        prevUserFriendlyHsl[0] = newValue;
                        props.onChange("#" + convert.hsl.hex(prevUserFriendlyHsl));
                        return prevUserFriendlyHsl;
                    });
                }}
            />
            <span className="hue-label" aria-hidden="true">
                {realHsl[0]}
            </span>
            <Slider
                wrapperClass="saturation-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                default={userFriendlyHsl[1]}
                pageIncrement={5}
                innerLabel="Saturation"
                style={{ backgroundImage: `linear-gradient(to right, ${hueDesaturated}, ${hueSaturated})` }}
                onChange={newValue => {
                    setUserFriendlyHsl(prevUserFriendlyHsl => {
                        prevUserFriendlyHsl[1] = newValue;
                        props.onChange("#" + convert.hsl.hex(prevUserFriendlyHsl));
                        return prevUserFriendlyHsl;
                    });
                }}
            />
            <span className="saturation-label" aria-hidden="true">
                {realHsl[1]}
            </span>
            <Slider
                wrapperClass="lightness-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                default={userFriendlyHsl[2]}
                pageIncrement={5}
                innerLabel="Lightness"
                style={{ backgroundImage: `linear-gradient(to right, #000000, ${hueMediumLightness}, #FFFFFF)` }}
                onChange={newValue => {
                    setUserFriendlyHsl(prevUserFriendlyHsl => {
                        prevUserFriendlyHsl[2] = newValue;
                        props.onChange("#" + convert.hsl.hex(prevUserFriendlyHsl));
                        return prevUserFriendlyHsl;
                    });
                }}
            />
            <span className="lightness-label" aria-hidden="true">
                {realHsl[2]}
            </span>
        </>
    );
}

export function CmykModifier(props) {
    const realCmyk = convert.hex.cmyk(props.color);
    const [userFriendlyCmyk, setUserFriendlyCmyk] = useState(getColorDataFromHex(props.color, "CMYK"));

    const cyanNone = "#" + convert.cmyk.hex(arrayCopyAndReplace(userFriendlyCmyk, 0, 0));
    const cyanFull = "#" + convert.cmyk.hex(arrayCopyAndReplace(userFriendlyCmyk, 0, 100));
    const magentaNone = "#" + convert.cmyk.hex(arrayCopyAndReplace(userFriendlyCmyk, 1, 0));
    const magentaFull = "#" + convert.cmyk.hex(arrayCopyAndReplace(userFriendlyCmyk, 1, 100));
    const yellowNone = "#" + convert.cmyk.hex(arrayCopyAndReplace(userFriendlyCmyk, 2, 0));
    const yellowFull = "#" + convert.cmyk.hex(arrayCopyAndReplace(userFriendlyCmyk, 2, 100));
    const keyNone = "#" + convert.cmyk.hex(arrayCopyAndReplace(userFriendlyCmyk, 3, 0));

    return (
        <>
            <Slider
                wrapperClass="cyan-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                default={userFriendlyCmyk[0]}
                pageIncrement={10}
                innerLabel="Cyan"
                style={{ backgroundImage: `linear-gradient(to right, ${cyanNone}, ${cyanFull})` }}
                onChange={newValue => {
                    setUserFriendlyCmyk(prevUserFriendlyCmyk => {
                        prevUserFriendlyCmyk[0] = newValue;
                        props.onChange("#" + convert.cmyk.hex(prevUserFriendlyCmyk));
                        return prevUserFriendlyCmyk;
                    });
                }}
            />
            <span className="cyan-label" aria-hidden="true">
                {realCmyk[0]}
            </span>
            <Slider
                wrapperClass="magenta-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                default={userFriendlyCmyk[1]}
                pageIncrement={5}
                innerLabel="Magenta"
                style={{ backgroundImage: `linear-gradient(to right, ${magentaNone}, ${magentaFull})` }}
                onChange={newValue => {
                    setUserFriendlyCmyk(prevUserFriendlyCmyk => {
                        prevUserFriendlyCmyk[1] = newValue;
                        props.onChange("#" + convert.cmyk.hex(prevUserFriendlyCmyk));
                        return prevUserFriendlyCmyk;
                    });
                }}
            />
            <span className="magenta-label" aria-hidden="true">
                {realCmyk[1]}
            </span>
            <Slider
                wrapperClass="yellow-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                default={userFriendlyCmyk[2]}
                pageIncrement={5}
                innerLabel="Yellow"
                style={{ backgroundImage: `linear-gradient(to right, ${yellowNone}, ${yellowFull})` }}
                onChange={newValue => {
                    setUserFriendlyCmyk(prevUserFriendlyCmyk => {
                        prevUserFriendlyCmyk[2] = newValue;
                        props.onChange("#" + convert.cmyk.hex(prevUserFriendlyCmyk));
                        return prevUserFriendlyCmyk;
                    });
                }}
            />
            <span className="yellow-label" aria-hidden="true">
                {realCmyk[2]}
            </span>
            <Slider
                wrapperClass="key-modifier"
                innerClass="modifier-thumb"
                max={100}
                min={0}
                default={userFriendlyCmyk[3]}
                pageIncrement={5}
                innerLabel="Key"
                style={{ backgroundImage: `linear-gradient(to right, ${keyNone}, #000000)` }}
                onChange={newValue => {
                    setUserFriendlyCmyk(prevUserFriendlyCmyk => {
                        prevUserFriendlyCmyk[3] = newValue;
                        props.onChange("#" + convert.cmyk.hex(prevUserFriendlyCmyk));
                        return prevUserFriendlyCmyk;
                    });
                }}
            />
            <span className="key-label" aria-hidden="true">
                {realCmyk[3]}
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

    return (
        <div className={`swatch ${props.selected ? "swatch-selected" : ""}`} tabIndex="0" aria-selected={props.selected ? "true" : undefined} style={{ backgroundColor: props.color }} onClick={props.onSelect}>
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
