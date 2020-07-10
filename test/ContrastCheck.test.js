import React from "react";
import PalettePicker from "../src/PalettePicker";
import { mount, shallow } from "enzyme";
import ContrastCheck, { ContrastType } from "../src/ContrastCheck";
import Swatch from "../src/Swatch";
import FocusTrap from "focus-trap-react";

describe("ContrastType renders properly and makes collapsable help text", () => {
    const contrastTypeWrapper = shallow(
        <ContrastType
            tooltip="A GUI component is any visual information required to identify UI components and states."
            typeName="GUI Components"
            standards={[
                { type: "standard", standardMet: true, standardRatio: 3, standardName: "WCAG AA" },
                { type: "standard", standardMet: false, standardRatio: 7, standardName: "WCAG AAA" },
                { type: "text", label: "10pt" },
                { type: "graphic", label: "GUI" },
            ]}
            foreground={{ hex: "#FFFFFF", colorData: [0, 0, 0] }}
            background={{ hex: "#AAAAAA", colorData: [100, 100, 100] }}
        />
    );

    it("Constructs static elements properly", () => {
        expect(contrastTypeWrapper.find(".contrast-checker-gui-components")).toHaveLength(1);
        expect(contrastTypeWrapper.find("h4")).toHaveLength(1);
        expect(contrastTypeWrapper.find("h4").text()).toEqual("GUI Components");
        expect(contrastTypeWrapper.find("button")).toHaveLength(1);
        expect(contrastTypeWrapper.find("button").prop("aria-describedby")).toEqual("#tooltip-gui-components");
        expect(contrastTypeWrapper.find("button").find("img")).toHaveLength(1);
        expect(contrastTypeWrapper.find("button").find("img").prop("alt")).toEqual("Show definition of gui components");
        expect(contrastTypeWrapper.find(".contrast-checker-tooltip")).toHaveLength(1);
        expect(contrastTypeWrapper.find(".contrast-checker-tooltip").hasClass("tooltip-open")).toEqual(false);
        expect(contrastTypeWrapper.find(".contrast-checker-tooltip").prop("role")).toEqual("tooltip");
        expect(contrastTypeWrapper.find(".contrast-checker-tooltip").prop("id")).toEqual("#tooltip-gui-components");
        expect(contrastTypeWrapper.find(".contrast-checker-tooltip").prop("aria-hidden")).toEqual(true);
    });

    it("Constructs standard-type child elements properly", () => {
        // First element with standard met
        const standardMet = contrastTypeWrapper.find(".standard-met");
        expect(standardMet).toHaveLength(1);
        expect(standardMet.find(".standard-compliance-box")).toHaveLength(1);
        expect(standardMet.find(".standard-compliance-box").find("img").prop("src")).toEqual("/assets/materialicons/material_check_lightgreen.svg");
        expect(standardMet.find(".standard-name")).toHaveLength(1);
        expect(standardMet.find(".standard-name").text()).toEqual("WCAG AA");
        expect(standardMet.find(".contrast-standard")).toHaveLength(1);
        expect(standardMet.find(".contrast-standard").text()).toEqual("3:1");

        // Second element with standard met
        const standardNotMet = contrastTypeWrapper.find(".standard-not-met");
        expect(standardNotMet).toHaveLength(1);
        expect(standardNotMet.find(".standard-compliance-box")).toHaveLength(1);
        expect(standardNotMet.find(".standard-compliance-box").find("img").prop("src")).toEqual("/assets/materialicons/material_close_lightred.svg");
        expect(standardNotMet.find(".standard-name")).toHaveLength(1);
        expect(standardNotMet.find(".standard-name").text()).toEqual("WCAG AAA");
        expect(standardNotMet.find(".contrast-standard")).toHaveLength(1);
        expect(standardNotMet.find(".contrast-standard").text()).toEqual("7:1");
    });

    it("Constructs text-type child elements properly", () => {
        const textWrapper = contrastTypeWrapper.find(".sample-gui-components").at(0);

        expect(textWrapper.prop("style").backgroundColor).toEqual("#FFFFFF");
        expect(textWrapper.find("span").at(0).text()).toEqual("10pt");
        expect(textWrapper.find("span").at(1).prop("style").color).toEqual("#AAAAAA");
        expect(textWrapper.find("span").at(1).text()).toEqual("The quick brown fox jumps over the lazy dog.");
    });

    it("Constructs graphic-type child elements properly", () => {
        const guiWrapper = contrastTypeWrapper.find(".sample-gui-components").at(1);

        expect(guiWrapper.prop("style").backgroundColor).toEqual("#FFFFFF");
        expect(guiWrapper.find("span").text()).toEqual("GUI");
        expect(guiWrapper.find(".shapes")).toHaveLength(1);
        expect(guiWrapper.find(".shapes").children()).toHaveLength(3);
        expect(guiWrapper.find(".shapes").children().at(0).prop("className")).toEqual("shape-1");
        expect(guiWrapper.find(".shapes").children().at(1).prop("className")).toEqual("shape-2");
        expect(guiWrapper.find(".shapes").children().at(2).prop("className")).toEqual("shape-3");
    });

    it("Toggles the help menu on button click", () => {
        contrastTypeWrapper.find("button").prop("onClick")();
        expect(contrastTypeWrapper.find(".contrast-checker-tooltip").hasClass("tooltip-open")).toEqual(true);
        expect(contrastTypeWrapper.find(".contrast-checker-tooltip").prop("aria-hidden")).toEqual(false);
    });
});

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
    const onChange = jest.fn();

    const contrastSwatches = { Main: { 1: { hex: "#FFEA70", colorData: [255, 234, 112] }, 2: { hex: "#4238FF", colorData: [66, 56, 255] } } };

    const appWrapper = shallow(<PalettePicker />);
    const contrastWrapper = shallow(<ContrastCheck swatches={contrastSwatches} onModalClose={() => {}} colorMode="RGB" selection={[defaultSelection, newSelection]} onChange={onChange} />);

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

    it("Displays correct contrast and swatches", () => {
        expect(contrastWrapper.find("h2").html()).toEqual("<h2>5.323:1</h2>");

        // Swatch 1
        expect(contrastWrapper.find("Swatch").at(0).prop("selected")).toEqual(false);
        expect(contrastWrapper.find("Swatch").at(0).prop("colorMode")).toEqual("RGB");
        expect(contrastWrapper.find("Swatch").at(0).prop("color")).toEqual(contrastSwatches.Main[1]);
        contrastWrapper.find("Swatch").at(0).prop("onChange")({ hex: "#FFEA6E", colorData: [255, 234, 110] });
        expect(onChange).toHaveBeenLastCalledWith("Main", 1, { hex: "#FFEA6E", colorData: [255, 234, 110] });

        // Swatch 2
        expect(contrastWrapper.find("Swatch").at(1).prop("selected")).toEqual(false);
        expect(contrastWrapper.find("Swatch").at(1).prop("colorMode")).toEqual("RGB");
        expect(contrastWrapper.find("Swatch").at(1).prop("color")).toEqual(contrastSwatches.Main[2]);
        contrastWrapper.find("Swatch").at(1).prop("onChange")({ hex: "#FFEA6E", colorData: [255, 234, 110] });
        expect(onChange).toHaveBeenLastCalledWith("Main", 2, { hex: "#FFEA6E", colorData: [255, 234, 110] });
    });

    it("Supplies contrast type components with proper props", () => {
        // Normal text
        const normalText = contrastWrapper.find(ContrastType).at(0);

        expect(normalText).toHaveLength(1);
        expect(normalText.prop("typeName")).toEqual("Normal Text");
        expect(normalText.prop("tooltip")).toEqual("Normal text is under 18pt, or under 16pt and bold.");
        expect(normalText.prop("foreground")).toEqual(contrastSwatches.Main[1]);
        expect(normalText.prop("background")).toEqual(contrastSwatches.Main[2]);

        const normalTextStandards = normalText.prop("standards");

        expect(normalTextStandards[0].type).toEqual("standard");
        expect(normalTextStandards[0].standardMet).toEqual(true);
        expect(normalTextStandards[0].standardRatio).toEqual(4.5);
        expect(normalTextStandards[0].standardName).toEqual("WCAG AA");

        expect(normalTextStandards[1].type).toEqual("standard");
        expect(normalTextStandards[1].standardMet).toEqual(false);
        expect(normalTextStandards[1].standardRatio).toEqual(7);
        expect(normalTextStandards[1].standardName).toEqual("WCAG AAA");

        expect(normalTextStandards[2].type).toEqual("text");
        expect(normalTextStandards[2].label).toEqual("12pt");

        // Large text
        const largeText = contrastWrapper.find(ContrastType).at(1);

        expect(largeText).toHaveLength(1);
        expect(largeText.prop("typeName")).toEqual("Large Text");
        expect(largeText.prop("tooltip")).toEqual("Large text is at least 18pt, or 16pt and bold.");
        expect(largeText.prop("foreground")).toEqual(contrastSwatches.Main[1]);
        expect(largeText.prop("background")).toEqual(contrastSwatches.Main[2]);

        const largeTextStandards = largeText.prop("standards");

        expect(largeTextStandards[0].type).toEqual("standard");
        expect(largeTextStandards[0].standardMet).toEqual(true);
        expect(largeTextStandards[0].standardRatio).toEqual(3);
        expect(largeTextStandards[0].standardName).toEqual("WCAG AA");

        expect(largeTextStandards[1].type).toEqual("standard");
        expect(largeTextStandards[1].standardMet).toEqual(true);
        expect(largeTextStandards[1].standardRatio).toEqual(4.5);
        expect(largeTextStandards[1].standardName).toEqual("WCAG AAA");

        expect(largeTextStandards[2].type).toEqual("text");
        expect(largeTextStandards[2].label).toEqual("18pt");

        // GUI components
        const gui = contrastWrapper.find(ContrastType).at(2);

        expect(gui).toHaveLength(1);
        expect(gui.prop("typeName")).toEqual("GUI Components");
        expect(gui.prop("tooltip")).toEqual("A GUI component is visual information required to identify UI components and states.");
        expect(gui.prop("foreground")).toEqual(contrastSwatches.Main[1]);
        expect(gui.prop("background")).toEqual(contrastSwatches.Main[2]);

        const guiStandards = gui.prop("standards");

        expect(guiStandards[0].type).toEqual("standard");
        expect(guiStandards[0].standardMet).toEqual(true);
        expect(guiStandards[0].standardRatio).toEqual(3);
        expect(guiStandards[0].standardName).toEqual("WCAG AA");

        expect(guiStandards[1].type).toEqual("graphic");
        expect(guiStandards[1].label).toEqual("GUI");
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
        expect(contrastCheckWrapper.find("button")).toHaveLength(4);
        expect(contrastCheckWrapper.find("button").at(0).prop("aria-label")).not.toEqual("");
        expect(contrastCheckWrapper.find("button").at(0).prop("aria-label")).not.toEqual(undefined);

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
        expect(contrastCheckWrapper.find("h2")).toHaveLength(1);
        expect(contrastCheckWrapper.find("h3")).toHaveLength(1);
        expect(contrastCheckWrapper.find(ContrastType)).toHaveLength(3);
    });

    it("Properly implements accessibility features", () => {
        // Focuses exit button on load
        expect(contrastCheckWrapper.find("button").at(0).is(":focus")).toEqual(true);

        // On escape key press, closes modal
        contrastCheckWrapper.find(".contrast-checker").prop("onKeyDown")({ keyCode: 27 });
        expect(exitModal).toHaveBeenCalledTimes(1);
        contrastCheckWrapper.find(".contrast-checker").prop("onKeyDown")({ keyCode: 26 });
        expect(exitModal).toHaveBeenCalledTimes(1);

        // On exit button press, closes modal
        contrastCheckWrapper.find("button").at(0).prop("onClick")();
        expect(exitModal).toHaveBeenCalledTimes(2);
    });
});
