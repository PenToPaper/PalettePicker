import React from "react";
import VerticalSlider from "./VerticalSlider";
import HueSaturationCircle from "./HueSaturationCircle";
import Dropdown from "./Dropdown";
import convert from "color-convert";
import { getColorDataFromHex } from "./ColorUtils";

export default function PaletteHeader(props) {
    const onBrightnessChange = (newBrightness) => {
        // More accurate representation if colorMode is already HSB
        let newHex;
        let newColorData;
        if (props.colorMode === "HSB") {
            newColorData = [props.swatches[props.selection.sectionName][props.selection.index].colorData[0], props.swatches[props.selection.sectionName][props.selection.index].colorData[1], newBrightness];
            newHex = "#" + convert.hsv.hex(newColorData);
        } else {
            let hsvColor = convert.hex.hsv(props.swatches[props.selection.sectionName][props.selection.index].hex);
            hsvColor[2] = newBrightness;
            newHex = "#" + convert.hsv.hex(hsvColor);
            newColorData = getColorDataFromHex(newHex, props.colorMode);
        }
        props.onChange(props.selection.sectionName, props.selection.index, { hex: newHex, colorData: newColorData });
    };

    const onHueSaturationChange = (hue, saturation, selection) => {
        // More accurate representation if colorMode is already HSB
        let newHex;
        let newColorData;
        if (props.colorMode === "HSB") {
            newColorData = [hue, saturation, props.swatches[selection.sectionName][selection.index].colorData[2]];
            newHex = "#" + convert.hsv.hex(newColorData);
        } else {
            let hsvColor = convert.hex.hsv(props.swatches[selection.sectionName][selection.index].hex);
            hsvColor[0] = hue;
            hsvColor[1] = saturation;
            newHex = "#" + convert.hsv.hex(hsvColor);
            newColorData = getColorDataFromHex(newHex, props.colorMode);
        }
        props.onChange(selection.sectionName, selection.index, { hex: newHex, colorData: newColorData });
    };

    return (
        <header>
            <VerticalSlider divClass="brightness-vertical" thumbClass="brightness-thumb" onChange={onBrightnessChange} />
            <HueSaturationCircle colorMode={props.colorMode} onSelectSwatch={props.onSelectSwatch} onPickColor={onHueSaturationChange} selection={props.selection} swatches={props.swatches} />
            <div className="header-toolbars">
                <label id="dropdown-color-harmony">Color Harmony</label>
                <Dropdown labelId="dropdown-color-harmony" options={["None", "Complementary", "Analogous", "Triad", "Split-Complementary", "Rectangle"]} selectedOption={props.colorHarmony} onChange={props.onColorHarmony} />
                <label id="dropdown-color-harmony">Color Mode</label>
                <Dropdown labelId="dropdown-color-mode" options={["HSB", "HSL", "RGB", "CMYK"]} selectedOption={props.colorMode} onChange={props.onColorMode} />
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
