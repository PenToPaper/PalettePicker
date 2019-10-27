import React from "react";
import { shallow, mount } from "enzyme";
import PaletteHeader from "../src/PaletteHeader";

describe("PaletteHeader includes color palette and proper tool selection menus", () => {
    const change = jest.fn();
    const compareColors = jest.fn();
    const contrastChecker = jest.fn();
    const colorMode = jest.fn();
    const colorHarmony = jest.fn();
    const headerWrapper = shallow(<PaletteHeader onChange={change} swatchData={{}} onCompareColors={compareColors} onContrastChecker={contrastChecker} onColorMode={colorMode} onColorHarmony={colorHarmony} />);

    it("Includes proper elements", () => {
        expect(headerWrapper.find("HueSaturationCircle")).toHaveLength(1);
        expect(headerWrapper.find("VerticalSlider")).toHaveLength(1);
        expect(headerWrapper.find(".header-toolbars")).toHaveLength(1);
        expect(headerWrapper.find("Dropdown")).toHaveLength(2);
        expect(headerWrapper.find(".header-tool")).toHaveLength(2);
        expect(headerWrapper.find("#compare-colors-tool")).toHaveLength(1);
        expect(headerWrapper.find("#contrast-checker-tool")).toHaveLength(1);
    });

    it("Assigns onClick event listeners to header tools", () => {
        expect(headerWrapper.find("#compare-colors-tool").prop("onClick")).not.toEqual(undefined);
        expect(headerWrapper.find("#contrast-checker-tool").prop("onClick")).not.toEqual(undefined);
    });

    it("Calls proper callback methods on header tool button click", () => {
        headerWrapper.find("#compare-colors-tool").prop("onClick")();
        expect(compareColors).toHaveBeenCalled();
        headerWrapper.find("#contrast-checker-tool").prop("onClick")();
        expect(contrastChecker).toHaveBeenCalled();
    });

    it("Calls proper callback methods on header tool dropdown change", () => {
        headerWrapper.find({ labelId: "dropdown-color-harmony" }).prop("onChange")();
        expect(colorHarmony).toHaveBeenCalled();
        headerWrapper.find({ labelId: "dropdown-color-mode" }).prop("onChange")();
        expect(colorMode).toHaveBeenCalled();
    });

    it("Calls proper callback methods on HueSaturationCircle and lightness-vertical elements change", () => {
        headerWrapper.find("HueSaturationCircle").prop("onPickColor")(1, 2);
        expect(change).toHaveBeenCalledWith("hue", 1);
        expect(change).toHaveBeenCalledWith("saturation", 2);
        headerWrapper.find("VerticalSlider").prop("onChange")(3);
        expect(change).toHaveBeenCalledWith("lightness", 3);
    });
});
