import React from "react";
import PalettePicker from "../src/PalettePicker";
import { mount, shallow } from "enzyme";
import CompareColors from "../src/CompareColors";
import Swatch from "../src/Swatch";
import FocusTrap from "focus-trap-react";

describe("CompareColors modal appears properly with correct props", () => {
    const appWrapper = shallow(<PalettePicker />);

    const defaultSwatches = appWrapper.find("PaletteHeader").prop("swatches");

    const defaultSelection = {
        sectionName: "Main",
        index: 1,
    };

    const newSelection = {
        sectionName: "Main",
        index: 2,
    };

    it("Renders the correct modal after button clicked and color selected", () => {
        // Press CompareColors button
        appWrapper.find("PaletteHeader").prop("onCompareColors")();

        // Attempts to select the already default selection, should not take
        appWrapper.find("PaletteHeader").prop("onSelectSwatch")(defaultSelection);

        expect(appWrapper.exists("CompareColors")).toEqual(false);

        // Change selection, should cause modal to appear
        appWrapper.find("PaletteHeader").prop("onSelectSwatch")(newSelection);

        expect(appWrapper.exists("CompareColors")).toEqual(true);
    });

    it("Is passed the correct props from PalettePicker", () => {
        expect(appWrapper.find("CompareColors").prop("colorMode")).toEqual("HSB");
        expect(appWrapper.find("CompareColors").prop("swatches")).toEqual(defaultSwatches);
        expect(appWrapper.find("CompareColors").prop("selection")).toEqual([defaultSelection, newSelection]);
    });

    it("Is passed the correct methods from PalettePicker", () => {
        expect(appWrapper.find("PaletteHeader").prop("swatches").Main[1].hex).toEqual(defaultSwatches.Main[1].hex);
        appWrapper.find("CompareColors").prop("onChange")(defaultSelection.sectionName, defaultSelection.index, { hex: "#FA840E", colorData: [30, 94, 98] });
        expect(appWrapper.find("PaletteHeader").prop("swatches").Main[1].hex).toEqual("#FA840E");

        appWrapper.find("CompareColors").prop("onModalClose")();
        expect(appWrapper.exists("CompareColors")).toEqual(false);
    });
});

describe("CompareColors modal is structured correctly and internal accessibility functions work properly", () => {
    const exitModal = jest.fn();
    const onChange = jest.fn();
    const colorMode = "HSB";
    const swatches = {
        Main: {
            1: { hex: "#00AAFF", colorData: [200, 100, 100] },
            2: { hex: "#FF00AA", colorData: [320, 100, 100] },
            3: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            4: { hex: "#FFFFFF", colorData: [0, 0, 100] },
        },
    };
    const modalSelection = [
        {
            sectionName: "Main",
            index: 1,
        },
        {
            sectionName: "Main",
            index: 2,
        },
    ];
    const compareColorsWrapper = mount(<CompareColors onModalClose={exitModal} colorMode={colorMode} swatches={swatches} selection={modalSelection} onChange={onChange} />);

    it("Renders properly based on props", () => {
        // FocusTrap
        expect(compareColorsWrapper.find(FocusTrap)).toHaveLength(1);

        // Modal Container
        expect(compareColorsWrapper.find(".compare-colors")).toHaveLength(1);
        expect(compareColorsWrapper.find(".compare-colors").hasClass("modal")).toEqual(true);
        expect(compareColorsWrapper.find(".compare-colors").prop("role")).toEqual("dialog");
        expect(compareColorsWrapper.find(".compare-colors").prop("aria-label")).not.toEqual("");
        expect(compareColorsWrapper.find(".compare-colors").prop("aria-label")).not.toEqual(undefined);
        expect(compareColorsWrapper.find(".compare-colors").prop("aria-modal")).toEqual("true");

        // Exit button
        expect(compareColorsWrapper.find("button")).toHaveLength(1);
        expect(compareColorsWrapper.find("button").prop("aria-label")).not.toEqual("");
        expect(compareColorsWrapper.find("button").prop("aria-label")).not.toEqual(undefined);

        // Swatches
        expect(compareColorsWrapper.find(Swatch)).toHaveLength(2);
        expect(compareColorsWrapper.find(Swatch).at(0).prop("selected")).toEqual(false);
        expect(compareColorsWrapper.find(Swatch).at(0).prop("colorMode")).toEqual("HSB");
        expect(compareColorsWrapper.find(Swatch).at(0).prop("color")).toEqual(swatches.Main[1]);
        compareColorsWrapper.find(Swatch).at(0).prop("onChange")({ hex: "#FFFFFF", colorData: [0, 0, 100] });
        expect(onChange).toHaveBeenLastCalledWith("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 100] });

        expect(compareColorsWrapper.find(Swatch)).toHaveLength(2);
        expect(compareColorsWrapper.find(Swatch).at(1).prop("selected")).toEqual(false);
        expect(compareColorsWrapper.find(Swatch).at(1).prop("colorMode")).toEqual("HSB");
        expect(compareColorsWrapper.find(Swatch).at(1).prop("color")).toEqual(swatches.Main[2]);
        compareColorsWrapper.find(Swatch).at(1).prop("onChange")({ hex: "#FFFFFF", colorData: [0, 0, 100] });
        expect(onChange).toHaveBeenLastCalledWith("Main", 2, { hex: "#FFFFFF", colorData: [0, 0, 100] });
    });

    it("Properly implements accessibility features", () => {
        // Focuses exit button on load
        expect(compareColorsWrapper.find("button").is(":focus")).toEqual(true);

        // On escape key press, closes modal
        compareColorsWrapper.find(".compare-colors").prop("onKeyDown")({ keyCode: 27 });
        expect(exitModal).toHaveBeenCalledTimes(1);
        compareColorsWrapper.find(".compare-colors").prop("onKeyDown")({ keyCode: 26 });
        expect(exitModal).toHaveBeenCalledTimes(1);

        // On exit button press, closes modal
        compareColorsWrapper.find("button").prop("onClick")();
        expect(exitModal).toHaveBeenCalledTimes(2);
    });
});
