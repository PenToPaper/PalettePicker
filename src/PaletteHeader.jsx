import React from "react";
import VerticalSlider from "./VerticalSlider";
import HueSaturationCircle from "./HueSaturationCircle";
import Dropdown from "./Dropdown";
import convert from "color-convert";

export default function PaletteHeader(props) {
    const onBrightnessChange = newBrightness => {
        let oldHsb = convert.hex.hsv(props.swatches[props.selection.sectionName][props.selection.index]);
        oldHsb[2] = newBrightness;
        const newHex = convert.hsv.hex(oldHsb);
        props.onChange(props.selection.sectionName, props.selection.index, "#" + newHex);
    };

    const onHueSaturationChange = (hue, saturation) => {
        let oldHsb = convert.hex.hsv(props.swatches[props.selection.sectionName][props.selection.index]);
        oldHsb[0] = hue;
        oldHsb[1] = saturation;
        const newHex = convert.hsv.hex(oldHsb);
        props.onChange(props.selection.sectionName, props.selection.index, "#" + newHex);
    };

    return (
        <header>
            <VerticalSlider divClass="brightness-vertical" thumbClass="brightness-thumb" onChange={onBrightnessChange} />
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
