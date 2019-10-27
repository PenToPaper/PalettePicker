import React from "react";
import VerticalSlider from "./VerticalSlider";
import HueSaturationCircle from "./HueSaturationCircle";
import Dropdown from "./Dropdown";
import convert from "color-convert";

export default function PaletteHeader(props) {
    const onLightnessChange = newLightness => {
        let oldHsl = convert.hex.hsl(props.swatches[props.selection.sectionName][props.selection.index]);
        oldHsl[2] = newLightness;
        const newHex = convert.hsl.hex(oldHsl);
        props.onChange(props.selection.sectionName, props.selection.index, "#" + newHex);
    };

    const onHueSaturationChange = (hue, saturation) => {
        let oldHsl = convert.hex.hsl(props.swatches[props.selection.sectionName][props.selection.index]);
        oldHsl[0] = hue;
        oldHsl[1] = saturation;
        const newHex = convert.hsl.hex(oldHsl);
        props.onChange(props.selection.sectionName, props.selection.index, "#" + newHex);
    };

    return (
        <header>
            <VerticalSlider divClass="lightness-vertical" thumbClass="lightness-thumb" onChange={onLightnessChange} />
            <HueSaturationCircle onPickColor={onHueSaturationChange} swatches={props.swatches} />
            <div className="header-toolbars">
                <label id="dropdown-color-harmony">Color Harmony</label>
                <Dropdown labelId="dropdown-color-harmony" options={["None", "Complementary", "Analogous", "Triad", "Split-Complementary", "Rectangle"]} selectedOptionIndex={0} onChange={props.onColorHarmony} />
                <label id="dropdown-color-harmony">Color Mode</label>
                <Dropdown labelId="dropdown-color-mode" options={["HSB", "HSL", "RGB", "CMYK"]} selectedOptionIndex={0} onChange={props.onColorMode} />
                <button className="header-tool" id="compare-colors-tool" onClick={props.onCompareColors}>
                    Compare Colors
                </button>
                <button className="header-tool" id="contrast-checker-tool" onClick={props.onContrastChecker}>
                    Contrast Checker
                </button>
            </div>
        </header>
    );
}