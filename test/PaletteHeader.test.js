import React from "react";
import { shallow, mount } from "enzyme";
import PaletteHeader from "../src/PaletteHeader";

describe("PaletteHeader includes color palette and proper tool selection menus", () => {
    const change = jest.fn();
    const compareColors = jest.fn();
    const contrastChecker = jest.fn();
    const colorMode = jest.fn();
    const colorHarmony = jest.fn();
    const swatchData = {
        Main: {
            1: "#FFFFFF",
            2: "#FFFFFF",
            3: "#FFFFFF",
            4: "#FFFFFF"
        }
    };
    const selection = { sectionName: "Main", index: 1 };
    const headerWrapper = shallow(<PaletteHeader onChange={change} selection={selection} swatches={swatchData} onCompareColors={compareColors} onContrastChecker={contrastChecker} onColorMode={colorMode} onColorHarmony={colorHarmony} />);

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
        const newSwatchData = Object.assign({}, swatchData);
        headerWrapper.find("VerticalSlider").prop("onChange")(50);
        expect(change).toHaveBeenLastCalledWith(selection.sectionName, selection.index, "#808080");
        newSwatchData[selection.sectionName][selection.index] = "#808080";
        headerWrapper.setProps({ swatchData: newSwatchData });
        headerWrapper.find("HueSaturationCircle").prop("onPickColor")(5, 10);
        expect(change).toHaveBeenLastCalledWith(selection.sectionName, selection.index, "#8C7573");
    });
});
