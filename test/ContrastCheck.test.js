import React from "react";
import PalettePicker from "../src/PalettePicker";
import { mount, shallow } from "enzyme";
import ContrastCheck from "../src/ContrastCheck";
import Swatch from "../src/Swatch";
import FocusTrap from "focus-trap-react";

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

describe("ContrastCheck modal is structured correctly and internal accessibility functions work properly", () => {
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
    const contrastCheckWrapper = mount(<ContrastCheck onModalClose={exitModal} colorMode={colorMode} swatches={swatches} selection={modalSelection} onChange={onChange} />);

    it("Renders properly based on props", () => {
        // FocusTrap
        expect(contrastCheckWrapper.find(FocusTrap)).toHaveLength(1);

        // Modal Container
        expect(contrastCheckWrapper.find(".contrast-checker")).toHaveLength(1);
        expect(contrastCheckWrapper.find(".contrast-checker").hasClass("modal")).toEqual(true);
        expect(contrastCheckWrapper.find(".contrast-checker").prop("role")).toEqual("dialog");
        expect(contrastCheckWrapper.find(".contrast-checker").prop("aria-label")).not.toEqual("");
        expect(contrastCheckWrapper.find(".contrast-checker").prop("aria-label")).not.toEqual(undefined);
        expect(contrastCheckWrapper.find(".contrast-checker").prop("aria-modal")).toEqual("true");

        // Exit button
        expect(contrastCheckWrapper.find("button")).toHaveLength(1);
        expect(contrastCheckWrapper.find("button").prop("aria-label")).not.toEqual("");
        expect(contrastCheckWrapper.find("button").prop("aria-label")).not.toEqual(undefined);

        // Swatches
        expect(contrastCheckWrapper.find(Swatch)).toHaveLength(2);
        expect(contrastCheckWrapper.find(Swatch).at(0).prop("selected")).toEqual(false);
        expect(contrastCheckWrapper.find(Swatch).at(0).prop("colorMode")).toEqual("HSB");
        expect(contrastCheckWrapper.find(Swatch).at(0).prop("color")).toEqual(swatches.Main[1]);
        contrastCheckWrapper.find(Swatch).at(0).prop("onChange")({ hex: "#FFFFFF", colorData: [0, 0, 100] });
        expect(onChange).toHaveBeenLastCalledWith("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 100] });

        expect(contrastCheckWrapper.find(Swatch)).toHaveLength(2);
        expect(contrastCheckWrapper.find(Swatch).at(1).prop("selected")).toEqual(false);
        expect(contrastCheckWrapper.find(Swatch).at(1).prop("colorMode")).toEqual("HSB");
        expect(contrastCheckWrapper.find(Swatch).at(1).prop("color")).toEqual(swatches.Main[2]);
        contrastCheckWrapper.find(Swatch).at(1).prop("onChange")({ hex: "#FFFFFF", colorData: [0, 0, 100] });
        expect(onChange).toHaveBeenLastCalledWith("Main", 2, { hex: "#FFFFFF", colorData: [0, 0, 100] });

        // Contrast display
        expect(contrastCheckWrapper.find(".contrast-checker-right").find("h2")).toHaveLength(1);
        expect(contrastCheckWrapper.find(".contrast-checker-right").find("h3")).toHaveLength(3);
        expect(contrastCheckWrapper.find(".contrast-checker-right").find(".standard-met")).toHaveLength(0);
        expect(contrastCheckWrapper.find(".contrast-checker-right").find(".standard-not-met")).toHaveLength(5);
        expect(contrastCheckWrapper.find(".contrast-checker-right").find("span")).toHaveLength(10);
        expect(contrastCheckWrapper.find(".contrast-checker-right").find("span.standard-name")).toHaveLength(5);
        expect(contrastCheckWrapper.find(".contrast-checker-right").find("span.contrast-standard")).toHaveLength(5);
    });

    it("Properly implements accessibility features", () => {
        // Focuses exit button on load
        expect(contrastCheckWrapper.find("button").is(":focus")).toEqual(true);

        // On escape key press, closes modal
        contrastCheckWrapper.find(".contrast-checker").prop("onKeyDown")({ keyCode: 27 });
        expect(exitModal).toHaveBeenCalledTimes(1);
        contrastCheckWrapper.find(".contrast-checker").prop("onKeyDown")({ keyCode: 26 });
        expect(exitModal).toHaveBeenCalledTimes(1);

        // On exit button press, closes modal
        contrastCheckWrapper.find("button").prop("onClick")();
        expect(exitModal).toHaveBeenCalledTimes(2);
    });
});
