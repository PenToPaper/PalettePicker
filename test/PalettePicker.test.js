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
        expect(appWrapper.find("PaletteBody").prop("swatches").Main[newKey].hex).toEqual("#FFFFFF");
    });
});

describe("PalletePicker complementary color functions work properly", () => {
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

describe("PalletePicker triad color functions work properly", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on triad color initilization", () => {
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Triad");

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(getSwatches().Main[1].hex).toEqual("#9A33FF");
    });

    it("Restricts swatch color changes to triad color scheme while active with changes to first index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#8000FF", colorData: [270, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#8000FF");
        expect(roundedColorData).toEqual([270, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#FF8000");
        expect(roundedColorData).toEqual([30, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#00FF80");
        expect(roundedColorData).toEqual([150, 100, 100]);
    });

    it("Restricts swatch color changes to triad color scheme while active with changes to second index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 2, { hex: "#8000FF", colorData: [270, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#00FF80");
        expect(roundedColorData).toEqual([150, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#8000FF");
        expect(roundedColorData).toEqual([270, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#FF8000");
        expect(roundedColorData).toEqual([30, 100, 100]);
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

describe("PalletePicker split complementary color functions work properly", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on triad color initilization", () => {
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Split-Complementary");

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(getSwatches().Main[1].hex).toEqual("#9A33FF");
    });

    it("Restricts swatch color changes to triad color scheme while active with changes to first index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#8000FF", colorData: [270, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#8000FF");
        expect(roundedColorData).toEqual([270, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#FFFF00");
        expect(roundedColorData).toEqual([60, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#00FF00");
        expect(roundedColorData).toEqual([120, 100, 100]);
    });

    it("Restricts swatch color changes to triad color scheme while active with changes to second index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 2, { hex: "#8000FF", colorData: [270, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);

        let roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#FF007F");
        expect(roundedColorData).toEqual([330, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#8000FF");
        expect(roundedColorData).toEqual([270, 100, 100]);

        roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#00FF00");
        expect(roundedColorData).toEqual([120, 100, 100]);
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

describe("PalletePicker analogous color functions work properly with 4 swatches", () => {
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

    it("Changes swatches properly on analogous color initilization", () => {
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Analogous");

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("4")).toEqual(true);
        expect(getSwatches().Main[1].hex).toEqual("#4D33FF");
    });

    it("Restricts swatch color changes to analogous color scheme while active with changes to first index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#0055FF", colorData: [220, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#0055FF");
        expect(roundedColorData).toEqual([220, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#3900FF");
        expect(roundedColorData).toEqual([254, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#C800FF");
        expect(roundedColorData).toEqual([287, 100, 100]);

        roundedColorData = getSwatches().Main[4].colorData.map(Math.round);
        expect(getSwatches().Main[4].hex).toEqual("#FF00A8");
        expect(roundedColorData).toEqual([321, 100, 100]);
    });

    it("Restricts swatch color changes to triad color scheme while active with changes to second index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 2, { hex: "#0015FF", colorData: [235, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#00FFBD");
        expect(roundedColorData).toEqual([164, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#0015FF");
        expect(roundedColorData).toEqual([235, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#FF00E7");
        expect(roundedColorData).toEqual([306, 100, 100]);

        roundedColorData = getSwatches().Main[4].colorData.map(Math.round);
        expect(getSwatches().Main[4].hex).toEqual("#FF4500");
        expect(roundedColorData).toEqual([16, 100, 100]);
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

describe("PalletePicker analogous color functions work properly with 5 swatches", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on analogous color initilization", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Analogous");

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("4")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("5")).toEqual(true);
        expect(getSwatches().Main[1].hex).toEqual("#3433FF");
    });

    it("Restricts swatch color changes to analogous color scheme while active with changes to first index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#0055FF", colorData: [220, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#0055FF");
        expect(roundedColorData).toEqual([220, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#1600FF");
        expect(roundedColorData).toEqual([245, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#8100FF");
        expect(roundedColorData).toEqual([270, 100, 100]);

        roundedColorData = getSwatches().Main[4].colorData.map(Math.round);
        expect(getSwatches().Main[4].hex).toEqual("#EC00FF");
        expect(roundedColorData).toEqual([295, 100, 100]);

        roundedColorData = getSwatches().Main[5].colorData.map(Math.round);
        expect(getSwatches().Main[5].hex).toEqual("#FF00A8");
        expect(roundedColorData).toEqual([321, 100, 100]);
    });

    it("Restricts swatch color changes to triad color scheme while active with changes to second index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 2, { hex: "#006AFF", colorData: [215, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#00FFA9");
        expect(roundedColorData).toEqual([160, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#006AFF");
        expect(roundedColorData).toEqual([215, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#8100FF");
        expect(roundedColorData).toEqual([270, 100, 100]);

        roundedColorData = getSwatches().Main[4].colorData.map(Math.round);
        expect(getSwatches().Main[4].hex).toEqual("#FF0092");
        expect(roundedColorData).toEqual([326, 100, 100]);

        roundedColorData = getSwatches().Main[5].colorData.map(Math.round);
        expect(getSwatches().Main[5].hex).toEqual("#FF5900");
        expect(roundedColorData).toEqual([21, 100, 100]);
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
