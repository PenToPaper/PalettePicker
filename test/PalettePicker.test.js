import React from "react";
import PalettePicker from "../src/PalettePicker";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";

describe("PalettePicker renders default state properly", () => {
    const defaultSelection = {
        sectionName: "Main",
        index: 1,
    };

    const appWrapper = shallow(<PalettePicker />);

    const defaultSwatches = JSON.parse(JSON.stringify(appWrapper.find("PaletteHeader").prop("swatches")));

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
        newSwatches.Main[3] = { hex: "#FFFAAA", colorData: [56, 33, 100] };

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 3, newSwatches.Main[3]);
        expect(appWrapper.find("PaletteHeader").prop("swatches")).toEqual(newSwatches);
    });

    it("Supplies child components with addSwatch method", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        expect(Object.keys(appWrapper.find("PaletteBody").prop("swatches").Main)).toHaveLength(5);
        let newKey = Object.keys(appWrapper.find("PaletteBody").prop("swatches").Main).filter((item) => !(item in defaultSwatches.Main));
        newKey = newKey[0];
        expect(appWrapper.find("PaletteBody").prop("swatches").Main[newKey].colorData).not.toEqual([0, 0, 0]);
        expect(appWrapper.find("PaletteBody").prop("swatches").Main[newKey].hex).not.toEqual("#FFFFFF");
    });
});

describe("PalletePicker complementary color functions work properly", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on complementary color initilization", () => {
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 0] });
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

    it("Still functions after adding extra sections", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("Main", "New Name");
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);

        const prevNewSection = getSwatches()["New Section 2"];

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 2, { hex: "#AA00FF", colorData: [280, 100, 100] });

        expect(Object.keys(getSwatches()["New Name"])).toHaveLength(2);
        expect(getSwatches()["New Name"][2].hex).toEqual("#AA00FF");
        expect(getSwatches()["New Name"][2].colorData).toEqual([280, 100, 100]);

        expect(getSwatches()["New Name"][1].hex).toEqual("#55FF00");
        expect(getSwatches()["New Name"][1].colorData).toEqual([100, 100, 100]);

        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(getSwatches()["New Section 2"]).toEqual(prevNewSection);
    });

    it("No longer restricts to color schemes when not active", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");

        const previousIndexTwo = Object.assign({}, getSwatches()["New Name"][2]);

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#55FF00", colorData: [100, 100, 100] });

        expect(getSwatches()["New Name"][1].hex).toEqual("#55FF00");
        expect(getSwatches()["New Name"][1].colorData).toEqual([100, 100, 100]);

        expect(getSwatches()["New Name"][2].hex).toEqual(previousIndexTwo.hex);
        expect(getSwatches()["New Name"][2].colorData).toEqual(previousIndexTwo.colorData);
    });
});

describe("PalletePicker triad color functions work properly", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on triad color initilization", () => {
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 0] });
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

    it("Still functions after adding extra sections", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("Main", "New Name");
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);

        const prevNewSection = getSwatches()["New Section 2"];

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#8000FF", colorData: [270, 100, 100] });

        expect(Object.keys(getSwatches()["New Name"])).toHaveLength(3);

        let roundedColorData = getSwatches()["New Name"][1].colorData.map(Math.round);
        expect(getSwatches()["New Name"][1].hex).toEqual("#8000FF");
        expect(roundedColorData).toEqual([270, 100, 100]);

        roundedColorData = getSwatches()["New Name"][2].colorData.map(Math.round);
        expect(getSwatches()["New Name"][2].hex).toEqual("#FF8000");
        expect(roundedColorData).toEqual([30, 100, 100]);

        roundedColorData = getSwatches()["New Name"][3].colorData.map(Math.round);
        expect(getSwatches()["New Name"][3].hex).toEqual("#00FF80");
        expect(roundedColorData).toEqual([150, 100, 100]);

        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(getSwatches()["New Section 2"]).toEqual(prevNewSection);
    });

    it("No longer restricts to color schemes when not active", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");

        const previousIndexTwo = Object.assign({}, getSwatches()["New Name"][2]);

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#55FF00", colorData: [100, 100, 100] });

        expect(getSwatches()["New Name"][1].hex).toEqual("#55FF00");
        expect(getSwatches()["New Name"][1].colorData).toEqual([100, 100, 100]);

        expect(getSwatches()["New Name"][2].hex).toEqual(previousIndexTwo.hex);
        expect(getSwatches()["New Name"][2].colorData).toEqual(previousIndexTwo.colorData);
    });
});

describe("PalletePicker split complementary color functions work properly", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on triad color initilization", () => {
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 0] });
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Split-Complementary");

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(getSwatches().Main[1].hex).toEqual("#9A33FF");
    });

    it("Restricts swatch color changes to split complementary color scheme while active with changes to first index color", () => {
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

    it("Restricts swatch color changes to split complementary color scheme while active with changes to second index color", () => {
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

    it("Still functions after adding extra sections", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("Main", "New Name");
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);

        const prevNewSection = getSwatches()["New Section 2"];

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#8000FF", colorData: [270, 100, 100] });

        expect(Object.keys(getSwatches()["New Name"])).toHaveLength(3);

        let roundedColorData = getSwatches()["New Name"][1].colorData.map(Math.round);
        expect(getSwatches()["New Name"][1].hex).toEqual("#8000FF");
        expect(roundedColorData).toEqual([270, 100, 100]);

        roundedColorData = getSwatches()["New Name"][2].colorData.map(Math.round);
        expect(getSwatches()["New Name"][2].hex).toEqual("#FFFF00");
        expect(roundedColorData).toEqual([60, 100, 100]);

        roundedColorData = getSwatches()["New Name"][3].colorData.map(Math.round);
        expect(getSwatches()["New Name"][3].hex).toEqual("#00FF00");
        expect(roundedColorData).toEqual([120, 100, 100]);

        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(getSwatches()["New Section 2"]).toEqual(prevNewSection);
    });

    it("No longer restricts to color schemes when not active", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");

        const previousIndexTwo = Object.assign({}, getSwatches()["New Name"][2]);

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#55FF00", colorData: [100, 100, 100] });

        expect(getSwatches()["New Name"][1].hex).toEqual("#55FF00");
        expect(getSwatches()["New Name"][1].colorData).toEqual([100, 100, 100]);

        expect(getSwatches()["New Name"][2].hex).toEqual(previousIndexTwo.hex);
        expect(getSwatches()["New Name"][2].colorData).toEqual(previousIndexTwo.colorData);
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

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 0] });
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

    it("Restricts swatch color changes to analogous color scheme while active with changes to second index color", () => {
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

    it("Still functions after adding extra sections", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("Main", "New Name");
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);

        const prevNewSection = getSwatches()["New Section 2"];

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 2, { hex: "#3C00FF", colorData: [254, 100, 100] });

        expect(Object.keys(getSwatches()["New Name"])).toHaveLength(4);

        let roundedColorData = getSwatches()["New Name"][1].colorData.map(Math.round);
        expect(getSwatches()["New Name"][1].hex).toEqual("#004FFF");
        expect(roundedColorData).toEqual([221, 100, 100]);

        roundedColorData = getSwatches()["New Name"][2].colorData.map(Math.round);
        expect(getSwatches()["New Name"][2].hex).toEqual("#3C00FF");
        expect(roundedColorData).toEqual([254, 100, 100]);

        roundedColorData = getSwatches()["New Name"][3].colorData.map(Math.round);
        expect(getSwatches()["New Name"][3].hex).toEqual("#C600FF");
        expect(roundedColorData).toEqual([287, 100, 100]);

        roundedColorData = getSwatches()["New Name"][4].colorData.map(Math.round);
        expect(getSwatches()["New Name"][4].hex).toEqual("#FF00AE");
        expect(roundedColorData).toEqual([319, 100, 100]);

        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(getSwatches()["New Section 2"]).toEqual(prevNewSection);
    });

    it("No longer restricts to color schemes when not active", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");

        const previousIndexTwo = Object.assign({}, getSwatches()["New Name"][2]);

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#55FF00", colorData: [100, 100, 100] });

        expect(getSwatches()["New Name"][1].hex).toEqual("#55FF00");
        expect(getSwatches()["New Name"][1].colorData).toEqual([100, 100, 100]);

        expect(getSwatches()["New Name"][2].hex).toEqual(previousIndexTwo.hex);
        expect(getSwatches()["New Name"][2].colorData).toEqual(previousIndexTwo.colorData);
    });
});

describe("PalletePicker analogous color functions work properly with 5 swatches", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on Rectangle color initilization", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 0] });
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

    it("Still functions after adding extra sections", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("Main", "New Name");
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);

        const prevNewSection = getSwatches()["New Section 2"];

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 3, { hex: "#AA00FF", colorData: [280, 100, 100] });

        expect(Object.keys(getSwatches()["New Name"])).toHaveLength(5);

        let roundedColorData = getSwatches()["New Name"][1].colorData.map(Math.round);
        expect(getSwatches()["New Name"][1].hex).toEqual("#00FFD2");
        expect(roundedColorData).toEqual([169, 100, 100]);

        roundedColorData = getSwatches()["New Name"][2].colorData.map(Math.round);
        expect(getSwatches()["New Name"][2].hex).toEqual("#0041FF");
        expect(roundedColorData).toEqual([225, 100, 100]);

        roundedColorData = getSwatches()["New Name"][3].colorData.map(Math.round);
        expect(getSwatches()["New Name"][3].hex).toEqual("#AA00FF");
        expect(roundedColorData).toEqual([280, 100, 100]);

        roundedColorData = getSwatches()["New Name"][4].colorData.map(Math.round);
        expect(getSwatches()["New Name"][4].hex).toEqual("#FF0069");
        expect(roundedColorData).toEqual([335, 100, 100]);

        roundedColorData = getSwatches()["New Name"][5].colorData.map(Math.round);
        expect(getSwatches()["New Name"][5].hex).toEqual("#FF8200");
        expect(roundedColorData).toEqual([31, 100, 100]);

        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(getSwatches()["New Section 2"]).toEqual(prevNewSection);
    });

    it("No longer restricts to color schemes when not active", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");

        const previousIndexTwo = Object.assign({}, getSwatches()["New Name"][2]);

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#55FF00", colorData: [100, 100, 100] });

        expect(getSwatches()["New Name"][1].hex).toEqual("#55FF00");
        expect(getSwatches()["New Name"][1].colorData).toEqual([100, 100, 100]);

        expect(getSwatches()["New Name"][2].hex).toEqual(previousIndexTwo.hex);
        expect(getSwatches()["New Name"][2].colorData).toEqual(previousIndexTwo.colorData);
    });
});

describe("PalletePicker Rectangle color functions work properly on click and drag", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on Rectangle color initilization", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 0] });
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Rectangle");

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("4")).toEqual(true);
        expect(getSwatches().Main[1].hex).toEqual("#FFEE33");
    });

    it("Restricts swatch color changes to rectangular color scheme while active with changes to first index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#66CC51", colorData: [110, 60, 80] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#66CC52");
        expect(roundedColorData).toEqual([110, 60, 80]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#52CCCC");
        expect(roundedColorData).toEqual([180, 60, 80]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#B852CC");
        expect(roundedColorData).toEqual([290, 60, 80]);

        roundedColorData = getSwatches().Main[4].colorData.map(Math.round);
        expect(getSwatches().Main[4].hex).toEqual("#CC5252");
        expect(roundedColorData).toEqual([0, 60, 80]);
    });

    it("Restricts swatch color changes to rectangular color scheme while active with changes to second index color", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 2, { hex: "#006AFF", colorData: [215, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#00FF6A");
        expect(roundedColorData).toEqual([145, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#006AFF");
        expect(roundedColorData).toEqual([215, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#FF0095");
        expect(roundedColorData).toEqual([325, 100, 100]);

        roundedColorData = getSwatches().Main[4].colorData.map(Math.round);
        expect(getSwatches().Main[4].hex).toEqual("#FF9500");
        expect(roundedColorData).toEqual([35, 100, 100]);
    });

    it("Still functions after adding extra sections", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("Main", "New Name");
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);

        const prevNewSection = getSwatches()["New Section 2"];

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 2, { hex: "#0040FF", colorData: [225, 100, 100] });

        expect(Object.keys(getSwatches()["New Name"])).toHaveLength(4);

        let roundedColorData = getSwatches()["New Name"][1].colorData.map(Math.round);
        expect(getSwatches()["New Name"][1].hex).toEqual("#00FF95");
        expect(roundedColorData).toEqual([155, 100, 100]);

        roundedColorData = getSwatches()["New Name"][2].colorData.map(Math.round);
        expect(getSwatches()["New Name"][2].hex).toEqual("#0040FF");
        expect(roundedColorData).toEqual([225, 100, 100]);

        roundedColorData = getSwatches()["New Name"][3].colorData.map(Math.round);
        expect(getSwatches()["New Name"][3].hex).toEqual("#FF006A");
        expect(roundedColorData).toEqual([335, 100, 100]);

        roundedColorData = getSwatches()["New Name"][4].colorData.map(Math.round);
        expect(getSwatches()["New Name"][4].hex).toEqual("#FFBF00");
        expect(roundedColorData).toEqual([45, 100, 100]);

        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(getSwatches()["New Section 2"]).toEqual(prevNewSection);
    });

    it("No longer restricts to color schemes when not active", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");

        const previousIndexTwo = Object.assign({}, getSwatches()["New Name"][2]);

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#55FF00", colorData: [100, 100, 100] });

        expect(getSwatches()["New Name"][1].hex).toEqual("#55FF00");
        expect(getSwatches()["New Name"][1].colorData).toEqual([100, 100, 100]);

        expect(getSwatches()["New Name"][2].hex).toEqual(previousIndexTwo.hex);
        expect(getSwatches()["New Name"][2].colorData).toEqual(previousIndexTwo.colorData);
    });
});

describe("PalletePicker Rectangle color functions work properly on SHIFT click and drag", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes swatches properly on Rectangle color initilization", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 0] });
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Rectangle");

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("4")).toEqual(true);
        expect(getSwatches().Main[1].hex).toEqual("#FFEE33");
    });

    it("Modifies arcOne and arcTwo on shift click", () => {
        appWrapper.find({ className: "body" }).prop("onKeyDown")({ keyCode: 16 });
        appWrapper.find("PaletteHeader").prop("onChange")("Main", "1", { hex: "#B8CC52", colorData: [70, 60, 80] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#B8CC52");
        expect(roundedColorData).toEqual([70, 60, 80]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#66CC52");
        expect(roundedColorData).toEqual([110, 60, 80]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#6652CC");
        expect(roundedColorData).toEqual([250, 60, 80]);

        roundedColorData = getSwatches().Main[4].colorData.map(Math.round);
        expect(getSwatches().Main[4].hex).toEqual("#B852CC");
        expect(roundedColorData).toEqual([290, 60, 80]);

        let preventDefaultPlaceholder = jest.fn();
        appWrapper.find({ className: "body" }).prop("onKeyUp")({ keyCode: 16, preventDefault: preventDefaultPlaceholder });
    });

    it("Continues to use new arcOne and arcTwo on normal click and drag", () => {
        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FF00FF", colorData: [300, 100, 100] });

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        let roundedColorData = getSwatches().Main[1].colorData.map(Math.round);
        expect(getSwatches().Main[1].hex).toEqual("#FF00FF");
        expect(roundedColorData).toEqual([300, 100, 100]);

        roundedColorData = getSwatches().Main[2].colorData.map(Math.round);
        expect(getSwatches().Main[2].hex).toEqual("#FF0055");
        expect(roundedColorData).toEqual([340, 100, 100]);

        roundedColorData = getSwatches().Main[3].colorData.map(Math.round);
        expect(getSwatches().Main[3].hex).toEqual("#00FF00");
        expect(roundedColorData).toEqual([120, 100, 100]);

        roundedColorData = getSwatches().Main[4].colorData.map(Math.round);
        expect(getSwatches().Main[4].hex).toEqual("#00FFAA");
        expect(roundedColorData).toEqual([160, 100, 100]);
    });

    it("Still functions after adding extra sections", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("Main", "New Name");
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);

        const prevNewSection = getSwatches()["New Section 2"];

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#FF00FF", colorData: [310, 100, 100] });

        expect(Object.keys(getSwatches()["New Name"])).toHaveLength(4);

        let roundedColorData = getSwatches()["New Name"][1].colorData.map(Math.round);
        expect(getSwatches()["New Name"][1].hex).toEqual("#FF00D4");
        expect(roundedColorData).toEqual([310, 100, 100]);

        roundedColorData = getSwatches()["New Name"][2].colorData.map(Math.round);
        expect(getSwatches()["New Name"][2].hex).toEqual("#FF002B");
        expect(roundedColorData).toEqual([350, 100, 100]);

        roundedColorData = getSwatches()["New Name"][3].colorData.map(Math.round);
        expect(getSwatches()["New Name"][3].hex).toEqual("#00FF2A");
        expect(roundedColorData).toEqual([130, 100, 100]);

        roundedColorData = getSwatches()["New Name"][4].colorData.map(Math.round);
        expect(getSwatches()["New Name"][4].hex).toEqual("#00FFD5");
        expect(roundedColorData).toEqual([170, 100, 100]);

        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(getSwatches()["New Section 2"]).toEqual(prevNewSection);
    });

    it("No longer restricts to color schemes when not active", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");

        const previousIndexTwo = Object.assign({}, getSwatches()["New Name"][2]);

        appWrapper.find("PaletteHeader").prop("onChange")("New Name", 1, { hex: "#55FF00", colorData: [100, 100, 100] });

        expect(getSwatches()["New Name"][1].hex).toEqual("#55FF00");
        expect(getSwatches()["New Name"][1].colorData).toEqual([100, 100, 100]);

        expect(getSwatches()["New Name"][2].hex).toEqual(previousIndexTwo.hex);
        expect(getSwatches()["New Name"][2].colorData).toEqual(previousIndexTwo.colorData);
    });
});

describe("PalletePicker addSwatch functionality is partially restricted with color harmony", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Adds a swatch properly by default", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);

        appWrapper.find("PaletteHeader").prop("onChange")("Main", 1, { hex: "#FFFFFF", colorData: [0, 0, 0] });
        expect(getSwatches().Main[1].hex).toEqual("#FFFFFF");
    });

    it("Rejects adding swatches to color harmonies that aren't Analogous", () => {
        // Rectangle
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Rectangle");

        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(getSwatches().Main[1].hex).not.toEqual("#FFFFFF");

        // Split complementary
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Split-Complementary");

        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(getSwatches().Main[1].hex).not.toEqual("#FFFFFF");

        // Triad
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Triad");

        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(getSwatches().Main[1].hex).not.toEqual("#FFFFFF");

        // Complementary
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Complementary");

        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(2);
        expect(getSwatches().Main[1].hex).not.toEqual("#FFFFFF");
    });

    it("Properly adds the new swatch to the color harmony in Analogous mode", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Analogous");

        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        expect(Object.keys(getSwatches().Main)).toHaveLength(5);
        expect(getSwatches().Main[1].hex).not.toEqual("#FFFFFF");
        expect(getSwatches().Main[2].hex).not.toEqual("#FFFFFF");
        expect(getSwatches().Main[3].hex).not.toEqual("#FFFFFF");
        expect(getSwatches().Main[4].hex).not.toEqual("#FFFFFF");
        expect(getSwatches().Main[5].hex).not.toEqual("#FFFFFF");
    });
});

describe("PalettePicker section modifiers function properly", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Changes default section name", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("Main", "New Name");
        expect(Object.keys(getSwatches())).toHaveLength(1);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
    });

    it("Changes swatch section name within selection if applicable", () => {
        // From previous test
        expect(appWrapper.find("PaletteHeader").prop("selection").sectionName).toEqual("New Name");
        expect(appWrapper.find("PaletteHeader").prop("selection").index).toEqual(1);
    });

    it("Adds new sections", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("Main")).toEqual(false);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);
    });

    it("Refuses to change section name if name already exists in list", () => {
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("New Name", "New Section 2");
        expect(Object.keys(getSwatches())).toHaveLength(2);
        expect(Object.keys(getSwatches()).includes("New Name")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("New Section 2")).toEqual(true);
    });

    it("Changes swatch section name within selection if applicable", () => {
        // From previous test
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("New Section 2", "New Section 3");
        expect(appWrapper.find("PaletteHeader").prop("selection").sectionName).toEqual("New Name");
        expect(appWrapper.find("PaletteHeader").prop("selection").index).toEqual(1);
    });

    it("Generates unique section names on section generation", () => {
        expect(Object.keys(getSwatches())).toHaveLength(2);
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("New Section 3", "New Section 1");
        appWrapper.find("PaletteBody").prop("onSectionNameChange")("New Name", "New Section 3");
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(3);
        expect(Object.keys(getSwatches()).includes("New Section 1")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("New Section 3")).toEqual(true);
        expect(Object.keys(getSwatches()).includes("New Section 4")).toEqual(true);
    });
});

describe("PalettePicker allows for deletion of swatches, but restricts when color harmonies are active", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Allows for the deletion of swatches when no harmonies are active", () => {
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "1");
        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("4")).toEqual(true);
    });

    it("Does not allow deletion of the last swatch in a given category", () => {
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        expect(Object.keys(getSwatches().Main)).toHaveLength(2);
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "3");
        expect(Object.keys(getSwatches().Main)).toHaveLength(1);
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "4");
        expect(Object.keys(getSwatches().Main)).toHaveLength(1);
        expect(Object.keys(getSwatches().Main).includes("4")).toEqual(true);
    });

    it("Moves selection to a new swatch on deletion of a selected swatch", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        const swatches = getSwatches().Main;
        const previouslySelectedKey = Object.keys(swatches)[3];

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        // Select 4th swatch
        appWrapper.find("PaletteHeader").prop("onSelectSwatch")({ sectionName: "Main", index: previouslySelectedKey });

        expect(appWrapper.find("PaletteHeader").prop("selection").sectionName).toEqual("Main");
        expect(appWrapper.find("PaletteHeader").prop("selection").index).toEqual(previouslySelectedKey);

        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", previouslySelectedKey);
        expect(Object.keys(getSwatches().Main)).toHaveLength(3);

        expect(appWrapper.find("PaletteHeader").prop("selection").sectionName).toEqual("Main");
        expect(appWrapper.find("PaletteHeader").prop("selection").index).toEqual("4");
    });

    it("Does not allow deletion of swatches when all color harmonies except analogous are selected", () => {
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Complementary");
        expect(Object.keys(getSwatches().Main)).toHaveLength(2);
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        expect(Object.keys(getSwatches().Main)).toHaveLength(2);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Triad");
        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        expect(Object.keys(getSwatches().Main)).toHaveLength(3);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Split-Complementary");
        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        expect(Object.keys(getSwatches().Main)).toHaveLength(3);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Rectangle");
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
    });

    it("Allows for deletion on analogous color harmony up to 2 swatches left", () => {
        const getAverageHue = (swatchSection) => {
            let totalHue = 0;
            for (let i = 0; i < Object.keys(swatchSection).length; i++) {
                totalHue += swatchSection[i + 1].colorData[0];
            }
            return totalHue / Object.keys(swatchSection).length;
        };

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Analogous");
        expect(Object.keys(getSwatches().Main)).toHaveLength(4);

        const averageHue = getAverageHue(getSwatches().Main);

        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);

        const averageHueAfter = getAverageHue(getSwatches().Main);

        expect(averageHue).toEqual(averageHueAfter);

        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        expect(Object.keys(getSwatches().Main)).toHaveLength(2);
    });
});

describe("PalettePicker allows for deletion of swatch sections", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Allows for deletion of swatch sections", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        expect(Object.keys(getSwatches())).toHaveLength(2);

        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 2");
        expect(Object.keys(getSwatches())).toHaveLength(1);
    });

    it("Moves selection to first swatch section first index if selected swatch is in deleted section", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();

        expect(Object.keys(getSwatches())).toHaveLength(4);
        expect(Object.keys(getSwatches()).indexOf("New Section 4")).toEqual(3);

        appWrapper.find("PaletteHeader").prop("onSelectSwatch")({ sectionName: "New Section 4", index: 1 });

        expect(appWrapper.find("PaletteBody").prop("selection")).toEqual({ sectionName: "New Section 4", index: 1 });

        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 4");

        expect(appWrapper.find("PaletteBody").prop("selection")).toEqual({ sectionName: "Main", index: "1" });

        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 3");
    });

    it("Does not move selection if selected swatch is NOT in deleted section", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();

        expect(Object.keys(getSwatches())).toHaveLength(4);
        expect(Object.keys(getSwatches()).indexOf("New Section 4")).toEqual(3);

        appWrapper.find("PaletteHeader").prop("onSelectSwatch")({ sectionName: "New Section 4", index: 1 });

        expect(appWrapper.find("PaletteBody").prop("selection")).toEqual({ sectionName: "New Section 4", index: 1 });

        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 3");

        expect(appWrapper.find("PaletteBody").prop("selection")).toEqual({ sectionName: "New Section 4", index: 1 });

        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 4");
    });

    it("Updates color harmony to None if deleting the first index swatch section", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Complementary");

        expect(appWrapper.find("PaletteHeader").prop("colorHarmony")).toEqual("Complementary");
        expect(Object.keys(getSwatches())).toHaveLength(2);

        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("Main");

        expect(Object.keys(getSwatches())).toHaveLength(1);
        expect(appWrapper.find("PaletteHeader").prop("colorHarmony")).toEqual("None");
    });

    it("Does not update color harmony if deleting the second index swatch section with a color harmony rule activated", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatchSection")();
        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Complementary");

        expect(appWrapper.find("PaletteHeader").prop("colorHarmony")).toEqual("Complementary");
        expect(Object.keys(getSwatches())).toHaveLength(2);

        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 3");

        expect(Object.keys(getSwatches())).toHaveLength(1);
        expect(appWrapper.find("PaletteHeader").prop("colorHarmony")).toEqual("Complementary");
    });

    it("Does not allow for deletion of swatch section if it is the last remaining one", () => {
        expect(Object.keys(getSwatches())).toHaveLength(1);
        appWrapper.find("PaletteBody").prop("onDeleteSwatchSection")("New Section 2");
        expect(Object.keys(getSwatches())).toHaveLength(1);
    });
});

describe("Restricts swatch indexes based on color harmony", () => {
    const appWrapper = shallow(<PalettePicker />);

    const getSwatches = () => {
        return appWrapper.find("PaletteHeader").prop("swatches");
    };

    it("Initializes all complementary harmonies properly, selection is moved if needed", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "1");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "3");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "4");

        expect(Object.keys(getSwatches().Main)).toHaveLength(2);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(false);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Complementary");
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");
    });

    it("Initializes all triad harmonies properly, selection is moved if needed", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "1");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "3");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "4");

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(false);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Triad");
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");
    });

    it("Initializes all split complementary harmonies properly, selection is moved if needed", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "1");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "3");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "4");

        expect(Object.keys(getSwatches().Main)).toHaveLength(3);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(false);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Split-Complementary");
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");
    });

    it("Initializes all rectangle harmonies properly, selection is moved if needed", () => {
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");
        appWrapper.find("PaletteBody").prop("onAddSwatch")("Main");

        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "1");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "2");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "3");
        appWrapper.find("PaletteBody").prop("onDeleteSwatch")("Main", "4");

        expect(Object.keys(getSwatches().Main)).toHaveLength(4);
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(false);
        expect(Object.keys(getSwatches().Main).includes("4")).toEqual(false);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("Rectangle");
        expect(Object.keys(getSwatches().Main).includes("1")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("2")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("3")).toEqual(true);
        expect(Object.keys(getSwatches().Main).includes("4")).toEqual(true);

        appWrapper.find("PaletteHeader").prop("onColorHarmony")("None");
    });
});
