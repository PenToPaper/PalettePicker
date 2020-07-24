import React, { useState, useEffect, useRef } from "react";
import Slider from "./Slider";
import convert from "color-convert";
import * as colorUtils from "./ColorUtils.js";

export function BufferedNumberInput(props) {
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        setIsEmpty(false);
    }, [props.color.colorData[props.index]]);

    const getNewColor = (newValue) => {
        const colorData = props.color.colorData.concat();
        colorData[props.index] = parseInt(newValue);
        const hex = "#" + colorUtils.getHexFromColorData(colorData, props.colorMode);
        return { hex, colorData };
    };

    const onInputChange = (newInput) => {
        let filteredInput = newInput.replace(/[^0-9]/g, "");
        const parsedNumber = parseInt(filteredInput);

        if (filteredInput === "") {
            setIsEmpty(true);
            return;
        }

        if (parsedNumber !== NaN && parsedNumber <= props.max && parsedNumber >= props.min) {
            props.onChange(getNewColor(parsedNumber));
            setIsEmpty(false);
        }
    };

    return (
        <input
            className={props.className}
            type="text"
            inputMode="numeric"
            value={isEmpty ? "" : Math.round(props.color.colorData[props.index]).toString()}
            onChange={(e) => {
                onInputChange(e.target.value);
            }}
            onBlur={() => {
                setIsEmpty(false);
            }}
            aria-label={`Modify this swatch's ${props.modifyingLabel}`}
        />
    );
}

export function HsbModifier(props) {
    const hueZero = "#" + convert.hsv.hex([0, props.color.colorData[1], props.color.colorData[2]]);
    const hueOne = "#" + convert.hsv.hex([300, props.color.colorData[1], props.color.colorData[2]]);
    const hueTwo = "#" + convert.hsv.hex([240, props.color.colorData[1], props.color.colorData[2]]);
    const hueThree = "#" + convert.hsv.hex([180, props.color.colorData[1], props.color.colorData[2]]);
    const hueFour = "#" + convert.hsv.hex([120, props.color.colorData[1], props.color.colorData[2]]);
    const hueFive = "#" + convert.hsv.hex([60, props.color.colorData[1], props.color.colorData[2]]);
    const hueSaturated = "#" + convert.hsv.hex(colorUtils.hsbReplaceValue(props.color.colorData, 1, 100));
    const hueDesaturated = "#" + convert.hsv.hex(colorUtils.hsbReplaceValue(props.color.colorData, 1, 0));
    const hueBright = "#" + convert.hsv.hex(colorUtils.hsbReplaceValue(props.color.colorData, 2, 100));

    return (
        <>
            <div className="modifier-row">
                <Slider
                    wrapperClass="hue-modifier"
                    innerClass="modifier-thumb"
                    max={360}
                    min={0}
                    value={props.color.colorData[0]}
                    pageIncrement={10}
                    style={{ backgroundImage: `linear-gradient(to left, ${hueZero}, ${hueOne}, ${hueTwo}, ${hueThree}, ${hueFour}, ${hueFive}, ${hueZero})` }}
                    innerLabel="Hue"
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 0, newValue);
                        props.onChange({ hex: "#" + convert.hsv.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={360} min={0} color={props.color} onChange={props.onChange} index={0} colorMode={"HSB"} className={"slider-input"} modifyingLabel={"hue"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="saturation-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    value={props.color.colorData[1]}
                    pageIncrement={5}
                    innerLabel="Saturation"
                    style={{ backgroundImage: `linear-gradient(to right, ${hueDesaturated}, ${hueSaturated})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 1, newValue);
                        props.onChange({ hex: "#" + convert.hsv.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={100} min={0} color={props.color} onChange={props.onChange} index={1} colorMode={"HSB"} className={"slider-input"} modifyingLabel={"saturation"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="brightness-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    value={props.color.colorData[2]}
                    pageIncrement={5}
                    innerLabel="Brightness"
                    style={{ backgroundImage: `linear-gradient(to right, #000000, ${hueBright})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 2, newValue);
                        props.onChange({ hex: "#" + convert.hsv.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={100} min={0} color={props.color} onChange={props.onChange} index={2} colorMode={"HSB"} className={"slider-input"} modifyingLabel={"brightness"} />
            </div>
        </>
    );
}

export function RgbModifier(props) {
    const redNone = "#" + convert.rgb.hex(colorUtils.hsbReplaceValue(props.color.colorData, 0, 0));
    const redFull = "#" + convert.rgb.hex(colorUtils.hsbReplaceValue(props.color.colorData, 0, 255));
    const greenNone = "#" + convert.rgb.hex(colorUtils.hsbReplaceValue(props.color.colorData, 1, 0));
    const greenFull = "#" + convert.rgb.hex(colorUtils.hsbReplaceValue(props.color.colorData, 1, 255));
    const blueNone = "#" + convert.rgb.hex(colorUtils.hsbReplaceValue(props.color.colorData, 2, 0));
    const blueFull = "#" + convert.rgb.hex(colorUtils.hsbReplaceValue(props.color.colorData, 2, 255));

    return (
        <>
            <div className="modifier-row">
                <Slider
                    wrapperClass="red-modifier"
                    innerClass="modifier-thumb"
                    max={255}
                    min={0}
                    value={props.color.colorData[0]}
                    pageIncrement={10}
                    innerLabel="Red"
                    style={{ backgroundImage: `linear-gradient(to right, ${redNone}, ${redFull})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 0, newValue);
                        props.onChange({ hex: "#" + convert.rgb.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={255} min={0} color={props.color} onChange={props.onChange} index={0} colorMode={"RGB"} className={"slider-input"} modifyingLabel={"red value"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="green-modifier"
                    innerClass="modifier-thumb"
                    max={255}
                    min={0}
                    value={props.color.colorData[1]}
                    pageIncrement={5}
                    innerLabel="Green"
                    style={{ backgroundImage: `linear-gradient(to right, ${greenNone}, ${greenFull})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 1, newValue);
                        props.onChange({ hex: "#" + convert.rgb.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={255} min={0} color={props.color} onChange={props.onChange} index={1} colorMode={"RGB"} className={"slider-input"} modifyingLabel={"green value"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="blue-modifier"
                    innerClass="modifier-thumb"
                    max={255}
                    min={0}
                    value={props.color.colorData[2]}
                    pageIncrement={5}
                    innerLabel="Blue"
                    style={{ backgroundImage: `linear-gradient(to right, ${blueNone}, ${blueFull})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 2, newValue);
                        props.onChange({ hex: "#" + convert.rgb.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={255} min={0} color={props.color} onChange={props.onChange} index={2} colorMode={"RGB"} className={"slider-input"} modifyingLabel={"blue value"} />
            </div>
        </>
    );
}

export function HslModifier(props) {
    const hueZero = "#" + convert.hsv.hex([0, props.color.colorData[1], props.color.colorData[2]]);
    const hueOne = "#" + convert.hsv.hex([300, props.color.colorData[1], props.color.colorData[2]]);
    const hueTwo = "#" + convert.hsv.hex([240, props.color.colorData[1], props.color.colorData[2]]);
    const hueThree = "#" + convert.hsv.hex([180, props.color.colorData[1], props.color.colorData[2]]);
    const hueFour = "#" + convert.hsv.hex([120, props.color.colorData[1], props.color.colorData[2]]);
    const hueFive = "#" + convert.hsv.hex([60, props.color.colorData[1], props.color.colorData[2]]);
    const hueSaturated = "#" + convert.hsl.hex(colorUtils.hsbReplaceValue(props.color.colorData, 1, 100));
    const hueDesaturated = "#" + convert.hsl.hex(colorUtils.hsbReplaceValue(props.color.colorData, 1, 0));
    const hueMediumLightness = "#" + convert.hsl.hex(colorUtils.hsbReplaceValue(props.color.colorData, 2, 50));

    return (
        <>
            <div className="modifier-row">
                <Slider
                    wrapperClass="hue-modifier"
                    innerClass="modifier-thumb"
                    max={360}
                    min={0}
                    value={props.color.colorData[0]}
                    pageIncrement={10}
                    innerLabel="Hue"
                    style={{ backgroundImage: `linear-gradient(to left, ${hueZero}, ${hueOne}, ${hueTwo}, ${hueThree}, ${hueFour}, ${hueFive}, ${hueZero})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 0, newValue);
                        props.onChange({ hex: "#" + convert.hsl.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={360} min={0} color={props.color} onChange={props.onChange} index={0} colorMode={"HSL"} className={"slider-input"} modifyingLabel={"hue"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="saturation-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    value={props.color.colorData[1]}
                    pageIncrement={5}
                    innerLabel="Saturation"
                    style={{ backgroundImage: `linear-gradient(to right, ${hueDesaturated}, ${hueSaturated})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 1, newValue);
                        props.onChange({ hex: "#" + convert.hsl.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={100} min={0} color={props.color} onChange={props.onChange} index={1} colorMode={"HSL"} className={"slider-input"} modifyingLabel={"saturation"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="lightness-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    value={props.color.colorData[2]}
                    pageIncrement={5}
                    innerLabel="Lightness"
                    style={{ backgroundImage: `linear-gradient(to right, #000000, ${hueMediumLightness}, #FFFFFF)` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 2, newValue);
                        props.onChange({ hex: "#" + convert.hsl.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={100} min={0} color={props.color} onChange={props.onChange} index={2} colorMode={"HSL"} className={"slider-input"} modifyingLabel={"lightness"} />
            </div>
        </>
    );
}

export function CmykModifier(props) {
    const cyanNone = "#" + convert.cmyk.hex(colorUtils.hsbReplaceValue(props.color.colorData, 0, 0));
    const cyanFull = "#" + convert.cmyk.hex(colorUtils.hsbReplaceValue(props.color.colorData, 0, 100));
    const magentaNone = "#" + convert.cmyk.hex(colorUtils.hsbReplaceValue(props.color.colorData, 1, 0));
    const magentaFull = "#" + convert.cmyk.hex(colorUtils.hsbReplaceValue(props.color.colorData, 1, 100));
    const yellowNone = "#" + convert.cmyk.hex(colorUtils.hsbReplaceValue(props.color.colorData, 2, 0));
    const yellowFull = "#" + convert.cmyk.hex(colorUtils.hsbReplaceValue(props.color.colorData, 2, 100));
    const keyNone = "#" + convert.cmyk.hex(colorUtils.hsbReplaceValue(props.color.colorData, 3, 0));

    return (
        <>
            <div className="modifier-row">
                <Slider
                    wrapperClass="cyan-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    value={props.color.colorData[0]}
                    pageIncrement={10}
                    innerLabel="Cyan"
                    style={{ backgroundImage: `linear-gradient(to right, ${cyanNone}, ${cyanFull})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 0, newValue);
                        props.onChange({ hex: "#" + convert.cmyk.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={100} min={0} color={props.color} onChange={props.onChange} index={0} colorMode={"CMYK"} className={"slider-input"} modifyingLabel={"cyan value"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="magenta-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    value={props.color.colorData[1]}
                    pageIncrement={5}
                    innerLabel="Magenta"
                    style={{ backgroundImage: `linear-gradient(to right, ${magentaNone}, ${magentaFull})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 1, newValue);
                        props.onChange({ hex: "#" + convert.cmyk.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={100} min={0} color={props.color} onChange={props.onChange} index={1} colorMode={"CMYK"} className={"slider-input"} modifyingLabel={"magenta value"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="yellow-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    value={props.color.colorData[2]}
                    pageIncrement={5}
                    innerLabel="Yellow"
                    style={{ backgroundImage: `linear-gradient(to right, ${yellowNone}, ${yellowFull})` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 2, newValue);
                        props.onChange({ hex: "#" + convert.cmyk.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={100} min={0} color={props.color} onChange={props.onChange} index={2} colorMode={"CMYK"} className={"slider-input"} modifyingLabel={"yellow value"} />
            </div>
            <div className="modifier-row">
                <Slider
                    wrapperClass="key-modifier"
                    innerClass="modifier-thumb"
                    max={100}
                    min={0}
                    value={props.color.colorData[3]}
                    pageIncrement={5}
                    innerLabel="Key"
                    style={{ backgroundImage: `linear-gradient(to right, ${keyNone}, #000000)` }}
                    innerStyle={{ backgroundColor: props.color.hex }}
                    onChange={(newValue) => {
                        const newColorData = colorUtils.hsbReplaceValue(props.color.colorData, 3, newValue);
                        props.onChange({ hex: "#" + convert.cmyk.hex(newColorData), colorData: newColorData });
                    }}
                />
                <BufferedNumberInput max={100} min={0} color={props.color} onChange={props.onChange} index={3} colorMode={"CMYK"} className={"slider-input"} modifyingLabel={"key value"} />
            </div>
        </>
    );
}

export default function Swatch(props) {
    const [hex, setHex] = useState(props.color.hex);
    let hexBeforeEdit = useRef(props.color.hex);

    useEffect(() => {
        if (props.color.hex !== hexBeforeEdit) {
            setHex(props.color.hex);
            hexBeforeEdit.current = props.color.hex;
        }
    }, [props.color]);

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

    const hasValidHexDigits = (hex) => {
        return hex.search(/^#[0-9A-F]{0,6}$/i) !== -1;
    };

    const onInputChange = (newHex) => {
        let newHexFormatted = newHex.toUpperCase();

        if (newHexFormatted.indexOf("#") === -1) {
            newHexFormatted = "#" + newHexFormatted;
        }

        if (colorUtils.isValidHex(newHexFormatted)) {
            // Publish new result
            props.onChange({ hex: newHexFormatted, colorData: colorUtils.getColorDataFromHex(newHexFormatted, props.colorMode) });
        } else if (hasValidHexDigits(newHexFormatted)) {
            setHex(newHexFormatted);
        }
    };

    const onBlur = (event) => {
        setHex(hexBeforeEdit.current);
    };

    return (
        <div className={`swatch ${props.selected ? "swatch-selected" : ""}`} tabIndex="0" aria-selected={props.selected ? "true" : undefined} style={{ backgroundColor: props.color.hex }} onClick={props.onSelect} onKeyDown={handleKeyDown}>
            <input
                type={"text"}
                value={hex}
                onChange={(e) => {
                    onInputChange(e.target.value);
                }}
                onBlur={onBlur}
                aria-label="Modify Swatch Hex Code"
            />
            {props.deleteButton && (
                <button
                    aria-label="Delete Swatch"
                    onClick={(event) => {
                        event.stopPropagation();
                        props.onDeleteSwatch();
                    }}
                >
                    <img src="/assets/materialicons/material_delete_offwhite.svg" alt="" />
                </button>
            )}

            <div className="swatch-modifier">{getCorrectModifier()}</div>
        </div>
    );
}
