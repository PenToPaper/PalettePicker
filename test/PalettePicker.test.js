import React from "react";
import PalettePicker from "../src/PalettePicker";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";

describe("PalettePicker renders default state properly", () => {
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
        expect(appWrapper.find("PaletteBody").prop("colorMode")).toEqual("HSB");
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
        let newKey = Object.keys(appWrapper.find("PaletteBody").prop("swatches").Main).filter((item) => !(item in defaultSwatches.Main));
        newKey = newKey[0];
        expect(appWrapper.find("PaletteBody").prop("swatches").Main[newKey]).toEqual("#FFFFFF");
    });
});

describe("PalletePicker color harmony functions work properly", () => {
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

    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on complementary color initilization", () => {
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Complementary");

        expect(Object.keys(getSwatches().Main)).toHaveLength(2);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(getSwatches().Main[1].hex).toEqual("#9A33FF");
    });

    it("Restricts swatch color changes to complementary color scheme while active", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 2, { hex: "#8000FF", colorData: [270, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(2);
        expect(getSwatches().Main[2].hex).toEqual("#8000FF");
        expect(getSwatches().Main[2].colorData).toEqual([270, 100, 100]);

        expect(getSwatches().Main[1].hex).toEqual("#80FF00");
        expect(getSwatches().Main[1].colorData).toEqual([90, 100, 100]);
    });

    it("No longer restricts to color schemes when not active", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");

        const previousIndexTwo = Object.assign({}, getSwatches().Main[2]);

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#55FF00", colorData: [100, 100, 100] });

        expect(getSwatches().Main[1].hex).toEqual("#55FF00");
        expect(getSwatches().Main[1].colorData).toEqual([100, 100, 100]);

        expect(getSwatches().Main[2].hex).toEqual(previousIndexTwo.hex);
        expect(getSwatches().Main[2].colorData).toEqual(previousIndexTwo.colorData);
    });
});
