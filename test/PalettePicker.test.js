import React from "react";
import PalettePicker from "../src/PalettePicker";
import { shallow } from "enzyme";

describe("PalettePicker renders default state properly", () => {
    const defaultSwatches = {
        Main: {
            1: "#ffffff",
            2: "#ffffff",
            3: "#ffffff",
            4: "#ffffff"
        }
    };
    const defaultSelection = {
        sectionName: "Main",
        index: 1
    };
    const appWrapper = shallow(<PalettePicker />);

    it("Includes all necessary components", () => {
        expect(appWrapper.find("Nav")).toHaveLength(1);
        expect(appWrapper.find("main")).toHaveLength(1);
        expect(appWrapper.find("main").find("PaletteHeader")).toHaveLength(1);
        expect(appWrapper.find("main").find("PaletteBody")).toHaveLength(1);
    });

    it("Supplies child components with proper props", () => {
        expect(appWrapper.find("PaletteHeader").prop("swatches")).toEqual(defaultSwatches);
        expect(typeof appWrapper.find("PaletteHeader").prop("onChange")).toEqual("function");
        expect(typeof appWrapper.find("PaletteHeader").prop("onCompareColors")).toEqual("function");
        expect(typeof appWrapper.find("PaletteHeader").prop("onContrastChecker")).toEqual("function");
        expect(typeof appWrapper.find("PaletteHeader").prop("onColorMode")).toEqual("function");
        expect(typeof appWrapper.find("PaletteHeader").prop("onColorHarmony")).toEqual("function");
        expect(appWrapper.find("PaletteHeader").prop("selection")).toEqual(defaultSelection);

        expect(appWrapper.find("PaletteBody").prop("swatches")).toEqual(defaultSwatches);
        expect(typeof appWrapper.find("PaletteBody").prop("onAddSwatch")).toEqual("function");
        expect(appWrapper.find("PaletteBody").prop("selection")).toEqual(defaultSelection);
    });

    it("Supplies child components with changeColor method", () => {
        const newSwatches = Object.assign({}, defaultSwatches);
        newSwatches.Main[3] = "#fffaaa";

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 3, newSwatches.Main[3]);
        expect(appWrapper.find("PaletteHeader").prop("swatches")).toEqual(newSwatches);
    });

    it("Supplies child components with addSwatch method", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        expect(Object.keys(appWrapper.find("PaletteBody").prop("swatches").Main)).toHaveLength(5);
        let newKey = Object.keys(appWrapper.find("PaletteBody").prop("swatches").Main).filter(item => !(item in defaultSwatches.Main));
        newKey = newKey[0];
        expect(appWrapper.find("PaletteBody").prop("swatches").Main[newKey]).toEqual("#ffffff");
    });
});
