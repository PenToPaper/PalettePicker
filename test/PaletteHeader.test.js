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
            1: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            2: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            3: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            4: { hex: "#FFFFFF", colorData: [0, 0, 100] },
        },
    };
    const selection = { sectionName: "Main", index: 1 };
    const headerWrapper = shallow(
        <PaletteHeader
            onChange={change}
            toolModal={{ status: "hidden" }}
            colorMode={"HSB"}
            selection={selection}
            swatches={swatchData}
            onCompareColors={compareColors}
            onContrastChecker={contrastChecker}
            onColorMode={colorMode}
            onColorHarmony={colorHarmony}
        />
    );

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

    it("Calls proper callback methods on HueSaturationCircle and brightness-vertical elements change", () => {
        const newSwatchData = Object.assign({}, swatchData);
        headerWrapper.find("VerticalSlider").prop("onChange")(50);
        expect(change).toHaveBeenLastCalledWith(selection.sectionName, selection.index, { hex: "#808080", colorData: [0, 0, 50] });
        newSwatchData[selection.sectionName][selection.index] = { hex: "#808080", colorData: [0, 0, 50] };
        headerWrapper.setProps({ swatchData: newSwatchData });
        headerWrapper.find("HueSaturationCircle").prop("onPickColor")(5, 10, { sectionName: "Main", index: 1 });
        expect(change).toHaveBeenLastCalledWith(selection.sectionName, selection.index, { hex: "#807473", colorData: [5, 10, 50] });
    });

    it("Changes class of tool buttons when proper tool modal is selecting", () => {
        expect(headerWrapper.find("button").at(0).hasClass("tool-selecting")).toEqual(false);
        expect(headerWrapper.find("button").at(0).hasClass("header-tool")).toEqual(true);

        expect(headerWrapper.find("button").at(1).hasClass("tool-selecting")).toEqual(false);
        expect(headerWrapper.find("button").at(1).hasClass("header-tool")).toEqual(true);

        headerWrapper.setProps({ toolModal: { status: "selecting", type: "compare" } });

        expect(headerWrapper.find("button").at(0).hasClass("tool-selecting")).toEqual(true);
        expect(headerWrapper.find("button").at(0).hasClass("header-tool")).toEqual(true);

        expect(headerWrapper.find("button").at(1).hasClass("tool-selecting")).toEqual(false);
        expect(headerWrapper.find("button").at(1).hasClass("header-tool")).toEqual(true);

        headerWrapper.setProps({ toolModal: { status: "selecting", type: "contrast" } });

        expect(headerWrapper.find("button").at(0).hasClass("tool-selecting")).toEqual(false);
        expect(headerWrapper.find("button").at(0).hasClass("header-tool")).toEqual(true);

        expect(headerWrapper.find("button").at(1).hasClass("tool-selecting")).toEqual(true);
        expect(headerWrapper.find("button").at(1).hasClass("header-tool")).toEqual(true);
    });
});
