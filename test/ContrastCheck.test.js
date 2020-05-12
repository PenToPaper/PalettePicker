import React from "react";
import PalettePicker from "../src/PalettePicker";
import ContrastCheck from "../src/ContrastCheck";
import { shallow } from "enzyme";

describe("ContrastCheck modal appears properly with correct props", () => {
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

    const contrastSwatches = { Main: { 1: { hex: "#FFEA70", colorData: [255, 234, 112] }, 2: { hex: "#4238FF", colorData: [66, 56, 255] } } };

    const appWrapper = shallow(<PalettePicker />);
    const contrastWrapper = shallow(<ContrastCheck swatches={contrastSwatches} onModalClose={() => {}} colorMode="RGB" selection={[defaultSelection, newSelection]} onChange={() => {}} />);

    it("Renders the correct modal after button clicked and color selected", () => {
        // Press ContrastCheck button
        appWrapper.find("PaletteHeader").prop("onContrastChecker")();

        // Attempts to select the already default selection, should not take
        appWrapper.find("PaletteHeader").prop("onSelectSwatch")(defaultSelection);

        expect(appWrapper.exists("ContrastCheck")).toEqual(false);

        // Change selection, should cause modal to appear
        appWrapper.find("PaletteHeader").prop("onSelectSwatch")(newSelection);

        expect(appWrapper.exists("ContrastCheck")).toEqual(true);
    });

    it("Is passed the correct props from PalettePicker", () => {
        expect(appWrapper.find("ContrastCheck").prop("colorMode")).toEqual("HSB");
        expect(appWrapper.find("ContrastCheck").prop("swatches")).toEqual(defaultSwatches);
        expect(appWrapper.find("ContrastCheck").prop("selection")).toEqual([defaultSelection, newSelection]);
    });

    it("Is passed the correct methods from PalettePicker", () => {
        expect(appWrapper.find("PaletteHeader").prop("swatches").Main[1].hex).toEqual("#FFFFFF");
        appWrapper.find("ContrastCheck").prop("onChange")(defaultSelection.sectionName, defaultSelection.index, { hex: "#FA840E", colorData: [30, 94, 98] });
        expect(appWrapper.find("PaletteHeader").prop("swatches").Main[1].hex).toEqual("#FA840E");

        appWrapper.find("ContrastCheck").prop("onModalClose")();
        expect(appWrapper.exists("ContrastCheck")).toEqual(false);
    });

    it("Properly displays contrast when supplied with colors", () => {
        expect(contrastWrapper.find("h2").html()).toEqual("<h2>5.323:1</h2>");
        expect(contrastWrapper.find(".standard-not-met").length).toEqual(1);
        expect(contrastWrapper.find(".standard-met").length).toEqual(4);
    });
});
