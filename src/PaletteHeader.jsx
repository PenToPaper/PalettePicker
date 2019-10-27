import React from "react";
import VerticalSlider from "./VerticalSlider";
import HueSaturationCircle from "./HueSaturationCircle";
import Dropdown from "./Dropdown";

export default function PaletteHeader(props) {
    const onLightnessChange = newLightness => {
        props.onChange("lightness", newLightness);
    };

    const onHueSaturationChange = (hue, saturation) => {
        props.onChange("hue", hue);
        props.onChange("saturation", saturation);
    };

    return (
        <header>
            <VerticalSlider divClass="lightness-vertical" thumbClass="lightness-thumb" onChange={onLightnessChange} />
            <HueSaturationCircle onPickColor={onHueSaturationChange} swatches={props.swatchData} />
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
