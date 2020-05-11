import React from "react";
import PalettePicker from "../src/PalettePicker";
import { shallow } from "enzyme";

describe("CompareColors modal appears properly with correct props", () => {
    const defaultSwatches = {
        Main: {
            1: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            2: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            3: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            4: { hex: "#FFFFFF", colorData: [0, 0, 100] },
        },
    };
    const defaultSelection = {
        sectionName: "Main",
        index: 1,
    };
    const newSelection = {
        sectionName: "Main",
        index: 2,
    };

    const appWrapper = shallow(<PalettePicker />);

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
        expect(appWrapper.find("PaletteHeader").prop("swatches").Main[1].hex).toEqual("#FFFFFF");
        appWrapper.find("CompareColors").prop("onChange")(defaultSelection.sectionName, defaultSelection.index, { hex: "#FA840E", colorData: [30, 94, 98] });
        expect(appWrapper.find("PaletteHeader").prop("swatches").Main[1].hex).toEqual("#FA840E");

        appWrapper.find("CompareColors").prop("onModalClose")();
        expect(appWrapper.exists("CompareColors")).toEqual(false);
    });
});
