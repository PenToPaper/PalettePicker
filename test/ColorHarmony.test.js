import React from "react";
import * as colorUtils from "../src/ColorUtils.js";
import PalettePicker from "../src/PalettePicker";
import { shallow } from "enzyme";

describe("Algorithms for finding color harmonies function correctly", () => {
    let colorDataMargin = (arrayOne, arrayTwo, margin = 1) => {
        for (let i = 0; i < arrayOne.length; i++) {
            if (Math.abs(arrayOne[i] - arrayTwo[i]) >= margin) {
                return "Problem with index" + i;
            }
        }
        return true;
    };

    it("Calculates single complementary color from hex as expected", () => {
        // Fully saturated color, wraparound from 270 hue to 90 hue
        expect(colorUtils.getComplementaryColorFromHex("#7F00FF").hex).toEqual("#80FF00");
        // Half saturated color, wraparound from 270 hue to 90 hue
        expect(colorUtils.getComplementaryColorFromHex("#BF7FFF").hex).toEqual("#BFFF7F");
        // Fully saturated color, no wraparound from 90 hue to 270 hue
        expect(colorUtils.getComplementaryColorFromHex("#81FF00").hex).toEqual("#7E00FF");
        // Half saturated color, no wraparound from 90 hue to 270 hue
        expect(colorUtils.getComplementaryColorFromHex("#C0FF7F").hex).toEqual("#BE7FFF");
        // Half saturated, half brightness color, wraparound from 270 hue to 90 hue
        expect(colorUtils.getComplementaryColorFromHex("#5F3F7F").hex).toEqual("#5F7F3F");
        // Half saturated, half brightness color, no wraparound from 90 hue to 270 hue
        expect(colorUtils.getComplementaryColorFromHex("#5F7F3F").hex).toEqual("#5F3F7F");
    });

    it("Calculates single complementary color from colorData as expected", () => {
        // Fully saturated color, wraparound from 270 hue to 90 hue
        expect(colorUtils.getComplementaryColorFromColorData([270, 100, 100]).colorData).toEqual([90, 100, 100]);
        expect(colorUtils.getComplementaryColorFromColorData([270, 100, 100]).hex).toEqual("#80FF00");
        // Half saturated color, wraparound from 270 hue to 90 hue
        expect(colorUtils.getComplementaryColorFromColorData([270, 50, 100]).colorData).toEqual([90, 50, 100]);
        expect(colorUtils.getComplementaryColorFromColorData([270, 50, 100]).hex).toEqual("#BFFF80");
        // Fully saturated color, no wraparound from 90 hue to 270 hue
        expect(colorUtils.getComplementaryColorFromColorData([90, 100, 100]).colorData).toEqual([270, 100, 100]);
        expect(colorUtils.getComplementaryColorFromColorData([90, 100, 100]).hex).toEqual("#8000FF");
        // Half saturated color, no wraparound from 90 hue to 270 hue
        expect(colorUtils.getComplementaryColorFromColorData([90, 50, 100]).colorData).toEqual([270, 50, 100]);
        expect(colorUtils.getComplementaryColorFromColorData([90, 50, 100]).hex).toEqual("#BF80FF");
        // Half saturated, half brightness color, wraparound from 270 hue to 90 hue
        expect(colorUtils.getComplementaryColorFromColorData([270, 50, 50]).colorData).toEqual([90, 50, 50]);
        expect(colorUtils.getComplementaryColorFromColorData([270, 50, 50]).hex).toEqual("#608040");
        // Half saturated, half brightness color, no wraparound from 90 hue to 270 hue
        expect(colorUtils.getComplementaryColorFromColorData([90, 50, 50]).colorData).toEqual([270, 50, 50]);
        expect(colorUtils.getComplementaryColorFromColorData([90, 50, 50]).hex).toEqual("#604080");
    });

    it("Calculates two Triad colors from colorData as expected", () => {
        // Fully saturated color, no wraparound from 80 hue to 200 hue to 320 hue
        let resultsArray = colorUtils.getTriadColorFromColorData([80, 100, 100]);
        expect(resultsArray[0].colorData).toEqual([200, 100, 100]);
        expect(resultsArray[0].hex).toEqual("#00AAFF");
        expect(resultsArray[1].colorData).toEqual([320, 100, 100]);
        expect(resultsArray[1].hex).toEqual("#FF00AA");
        // Fully saturated color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromColorData([125, 100, 100]);
        expect(resultsArray[0].colorData).toEqual([245, 100, 100]);
        expect(resultsArray[0].hex).toEqual("#1500FF");
        expect(resultsArray[1].colorData).toEqual([5, 100, 100]);
        expect(resultsArray[1].hex).toEqual("#FF1500");
        // Half saturated color, no wraparound from 80 hue to 200 hue to 320 hue
        resultsArray = colorUtils.getTriadColorFromColorData([80, 50, 100]);
        expect(resultsArray[0].colorData).toEqual([200, 50, 100]);
        expect(resultsArray[0].hex).toEqual("#80D4FF");
        expect(resultsArray[1].colorData).toEqual([320, 50, 100]);
        expect(resultsArray[1].hex).toEqual("#FF80D5");
        // Half saturated color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromColorData([125, 50, 100]);
        expect(resultsArray[0].colorData).toEqual([245, 50, 100]);
        expect(resultsArray[0].hex).toEqual("#8A80FF");
        expect(resultsArray[1].colorData).toEqual([5, 50, 100]);
        expect(resultsArray[1].hex).toEqual("#FF8A80");
        // Half saturated + half brightness color, no wraparound from 80 hue to 200 hue to 320 hue
        resultsArray = colorUtils.getTriadColorFromColorData([80, 50, 50]);
        expect(resultsArray[0].colorData).toEqual([200, 50, 50]);
        expect(resultsArray[0].hex).toEqual("#406A80");
        expect(resultsArray[1].colorData).toEqual([320, 50, 50]);
        expect(resultsArray[1].hex).toEqual("#80406A");
        // Half saturated + half brightness color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromColorData([125, 50, 50]);
        expect(resultsArray[0].colorData).toEqual([245, 50, 50]);
        expect(resultsArray[0].hex).toEqual("#454080");
        expect(resultsArray[1].colorData).toEqual([5, 50, 50]);
        expect(resultsArray[1].hex).toEqual("#804540");
    });

    it("Calculates two Triad colors from hex as expected", () => {
        // Fully saturated color, no wraparound from 80 hue to 200 hue to 320 hue
        let resultsArray = colorUtils.getTriadColorFromHex("#AAFF00");
        expect(colorDataMargin(resultsArray[0].colorData, [200, 100, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#00AAFF");
        expect(colorDataMargin(resultsArray[1].colorData, [320, 100, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#FF00AA");
        // Fully saturated color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromHex("#00FF15");
        expect(colorDataMargin(resultsArray[0].colorData, [245, 100, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#1500FF");
        expect(colorDataMargin(resultsArray[1].colorData, [5, 100, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#FF1500");
        // Half saturated color, no wraparound from 80 hue to 200 hue to 320 hue
        resultsArray = colorUtils.getTriadColorFromHex("#D5FF80");
        expect(colorDataMargin(resultsArray[0].colorData, [200, 50, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#80D5FF");
        expect(colorDataMargin(resultsArray[1].colorData, [320, 50, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#FF80D5");
        // Half saturated color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromHex("#80FF8A");
        expect(colorDataMargin(resultsArray[0].colorData, [245, 50, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#8A80FF");
        expect(colorDataMargin(resultsArray[1].colorData, [5, 50, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#FF8A80");
        // Half saturated + half brightness color, no wraparound from 80 hue to 200 hue to 320 hue
        resultsArray = colorUtils.getTriadColorFromHex("#6A8040");
        expect(colorDataMargin(resultsArray[0].colorData, [200, 50, 50])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#406A80");
        expect(colorDataMargin(resultsArray[1].colorData, [320, 50, 50])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#80406A");
        // Half saturated + half brightness color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromHex("#408045");
        expect(colorDataMargin(resultsArray[0].colorData, [245, 50, 50])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#454080");
        expect(colorDataMargin(resultsArray[1].colorData, [5, 50, 50])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#804540");
    });

    it("Calculates two Split Complementary colors from colorData as expected", () => {
        // Fully saturated color, no wraparound from 20 hue to 170 hue to 230 hue
        let resultsArray = colorUtils.getSplitComplementaryColorFromColorData([20, 100, 100]);
        expect(colorDataMargin(resultsArray[0].colorData, [170, 100, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#00FFD5");
        expect(colorDataMargin(resultsArray[1].colorData, [230, 100, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#002AFF");
        // Fully saturated color, wraparound from 160 hue to 310 hue to 10 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromColorData([160, 100, 100]);
        expect(colorDataMargin(resultsArray[0].colorData, [310, 100, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#FF00D4");
        expect(colorDataMargin(resultsArray[1].colorData, [10, 100, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#FF2A00");
        // Half saturated color, no wraparound from 20 hue to 170 hue to 230 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromColorData([20, 50, 100]);
        expect(colorDataMargin(resultsArray[0].colorData, [170, 50, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#80FFEA");
        expect(colorDataMargin(resultsArray[1].colorData, [230, 50, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#8095FF");
        // Half saturated color, wraparound from 160 hue to 310 hue to 10 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromColorData([160, 50, 100]);
        expect(colorDataMargin(resultsArray[0].colorData, [310, 50, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#FF80EA");
        expect(colorDataMargin(resultsArray[1].colorData, [10, 50, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#FF9580");
        // Half saturated + half brightness color, no wraparound from 20 hue to 170 hue to 230 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromColorData([20, 50, 50]);
        expect(colorDataMargin(resultsArray[0].colorData, [170, 50, 50])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#408075");
        expect(colorDataMargin(resultsArray[1].colorData, [230, 50, 50])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#404A80");
        // Half saturated + half brightness color, wraparound from 160 hue to 310 hue to 10 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromColorData([160, 50, 50]);
        expect(colorDataMargin(resultsArray[0].colorData, [310, 50, 50])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#804075");
        expect(colorDataMargin(resultsArray[1].colorData, [10, 50, 50])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#804A40");
    });

    it("Calculates two Split Complementary colors from hex as expected", () => {
        // Fully saturated color, no wraparound from 20 hue to 170 hue to 230 hue
        let resultsArray = colorUtils.getSplitComplementaryColorFromHex("#FF5500");
        expect(colorDataMargin(resultsArray[0].colorData, [170, 100, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#00FFD5");
        expect(colorDataMargin(resultsArray[1].colorData, [230, 100, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#002AFF");
        // Fully saturated color, wraparound from 160 hue to 310 hue to 10 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromHex("#00FFAA");
        expect(colorDataMargin(resultsArray[0].colorData, [310, 100, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#FF00D4");
        expect(colorDataMargin(resultsArray[1].colorData, [10, 100, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#FF2A00");
        // Half saturated color, no wraparound from 20 hue to 170 hue to 230 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromHex("#FFAA80");
        expect(colorDataMargin(resultsArray[0].colorData, [170, 50, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#80FFEA");
        expect(colorDataMargin(resultsArray[1].colorData, [230, 50, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#8095FF");
        // Half saturated color, wraparound from 160 hue to 310 hue to 10 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromHex("#80FFD5");
        expect(colorDataMargin(resultsArray[0].colorData, [310, 50, 100])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#FF80EA");
        expect(colorDataMargin(resultsArray[1].colorData, [10, 50, 100])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#FF9580");
        // Half saturated + half brightness color, no wraparound from 20 hue to 170 hue to 230 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromHex("#805540");
        expect(colorDataMargin(resultsArray[0].colorData, [170, 50, 50])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#408075");
        expect(colorDataMargin(resultsArray[1].colorData, [230, 50, 50])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#404B80");
        // Half saturated + half brightness color, wraparound from 160 hue to 310 hue to 10 hue
        resultsArray = colorUtils.getSplitComplementaryColorFromHex("#40806A");
        expect(colorDataMargin(resultsArray[0].colorData, [310, 50, 50])).toEqual(true);
        expect(resultsArray[0].hex).toEqual("#804076");
        expect(colorDataMargin(resultsArray[1].colorData, [10, 50, 50])).toEqual(true);
        expect(resultsArray[1].hex).toEqual("#804A40");
    });

    it("Calculates 5 analogous colors from colorData as expected", () => {
        // Fully saturated color, no wraparound from 100 hue
        let resultsArray = colorUtils.getAnalogousColorFromHSBCenter([100, 100, 100], 10, 5);
        expect(colorDataMargin(resultsArray["1"].colorData, [80, 100, 100])).toEqual(true);
        expect(resultsArray["1"].hex).toEqual("#AAFF00");
        expect(colorDataMargin(resultsArray["2"].colorData, [90, 100, 100])).toEqual(true);
        expect(resultsArray["2"].hex).toEqual("#80FF00");
        expect(colorDataMargin(resultsArray["3"].colorData, [100, 100, 100])).toEqual(true);
        expect(resultsArray["3"].hex).toEqual("#55FF00");
        expect(colorDataMargin(resultsArray["4"].colorData, [110, 100, 100])).toEqual(true);
        expect(resultsArray["4"].hex).toEqual("#2BFF00");
        expect(colorDataMargin(resultsArray["5"].colorData, [120, 100, 100])).toEqual(true);
        expect(resultsArray["5"].hex).toEqual("#00FF00");
        // Half saturated, half brightness color, no wraparound from 100 hue
        resultsArray = colorUtils.getAnalogousColorFromHSBCenter([100, 50, 50], 10, 5);
        expect(colorDataMargin(resultsArray["1"].colorData, [80, 50, 50])).toEqual(true);
        expect(resultsArray["1"].hex).toEqual("#6A8040");
        expect(colorDataMargin(resultsArray["2"].colorData, [90, 50, 50])).toEqual(true);
        expect(resultsArray["2"].hex).toEqual("#608040");
        expect(colorDataMargin(resultsArray["3"].colorData, [100, 50, 50])).toEqual(true);
        expect(resultsArray["3"].hex).toEqual("#558040");
        expect(colorDataMargin(resultsArray["4"].colorData, [110, 50, 50])).toEqual(true);
        expect(resultsArray["4"].hex).toEqual("#4A8040");
        expect(colorDataMargin(resultsArray["5"].colorData, [120, 50, 50])).toEqual(true);
        expect(resultsArray["5"].hex).toEqual("#408040");
        // Fully saturated color, wraparound from 0 hue
        resultsArray = colorUtils.getAnalogousColorFromHSBCenter([0, 100, 100], 10, 5);
        expect(colorDataMargin(resultsArray["1"].colorData, [340, 100, 100])).toEqual(true);
        expect(resultsArray["1"].hex).toEqual("#FF0055");
        expect(colorDataMargin(resultsArray["2"].colorData, [350, 100, 100])).toEqual(true);
        expect(resultsArray["2"].hex).toEqual("#FF002B");
        expect(colorDataMargin(resultsArray["3"].colorData, [0, 100, 100])).toEqual(true);
        expect(resultsArray["3"].hex).toEqual("#FF0000");
        expect(colorDataMargin(resultsArray["4"].colorData, [10, 100, 100])).toEqual(true);
        expect(resultsArray["4"].hex).toEqual("#FF2A00");
        expect(colorDataMargin(resultsArray["5"].colorData, [20, 100, 100])).toEqual(true);
        expect(resultsArray["5"].hex).toEqual("#FF5500");
        // Half saturated color, half brightness color, wraparound from 0 hue
        resultsArray = colorUtils.getAnalogousColorFromHSBCenter([0, 50, 50], 10, 5);
        expect(colorDataMargin(resultsArray["1"].colorData, [340, 50, 50])).toEqual(true);
        expect(resultsArray["1"].hex).toEqual("#804055");
        expect(colorDataMargin(resultsArray["2"].colorData, [350, 50, 50])).toEqual(true);
        expect(resultsArray["2"].hex).toEqual("#80404A");
        expect(colorDataMargin(resultsArray["3"].colorData, [0, 50, 50])).toEqual(true);
        expect(resultsArray["3"].hex).toEqual("#804040");
        expect(colorDataMargin(resultsArray["4"].colorData, [10, 50, 50])).toEqual(true);
        expect(resultsArray["4"].hex).toEqual("#804A40");
        expect(colorDataMargin(resultsArray["5"].colorData, [20, 50, 50])).toEqual(true);
        expect(resultsArray["5"].hex).toEqual("#805540");
    });

    it("Calculates 4 analogous colors from colorData as expected", () => {
        // Fully saturated color, no wraparound from 100 hue
        let resultsArray = colorUtils.getAnalogousColorFromHSBCenter([100, 100, 100], 20, 4);
        expect(colorDataMargin(resultsArray["1"].colorData, [70, 100, 100])).toEqual(true);
        expect(resultsArray["1"].hex).toEqual("#D4FF00");
        expect(colorDataMargin(resultsArray["2"].colorData, [90, 100, 100])).toEqual(true);
        expect(resultsArray["2"].hex).toEqual("#80FF00");
        expect(colorDataMargin(resultsArray["3"].colorData, [110, 100, 100])).toEqual(true);
        expect(resultsArray["3"].hex).toEqual("#2BFF00");
        expect(colorDataMargin(resultsArray["4"].colorData, [130, 100, 100])).toEqual(true);
        expect(resultsArray["4"].hex).toEqual("#00FF2A");
        // Half saturated, half brightness color, no wraparound from 100 hue
        resultsArray = colorUtils.getAnalogousColorFromHSBCenter([100, 50, 50], 20, 4);
        expect(colorDataMargin(resultsArray["1"].colorData, [70, 50, 50])).toEqual(true);
        expect(resultsArray["1"].hex).toEqual("#758040");
        expect(colorDataMargin(resultsArray["2"].colorData, [90, 50, 50])).toEqual(true);
        expect(resultsArray["2"].hex).toEqual("#608040");
        expect(colorDataMargin(resultsArray["3"].colorData, [110, 50, 50])).toEqual(true);
        expect(resultsArray["3"].hex).toEqual("#4A8040");
        expect(colorDataMargin(resultsArray["4"].colorData, [130, 50, 50])).toEqual(true);
        expect(resultsArray["4"].hex).toEqual("#40804A");
        // Fully saturated color, wraparound from 0 hue
        resultsArray = colorUtils.getAnalogousColorFromHSBCenter([0, 100, 100], 20, 4);
        expect(colorDataMargin(resultsArray["1"].colorData, [330, 100, 100])).toEqual(true);
        expect(resultsArray["1"].hex).toEqual("#FF0080");
        expect(colorDataMargin(resultsArray["2"].colorData, [350, 100, 100])).toEqual(true);
        expect(resultsArray["2"].hex).toEqual("#FF002B");
        expect(colorDataMargin(resultsArray["3"].colorData, [10, 100, 100])).toEqual(true);
        expect(resultsArray["3"].hex).toEqual("#FF2A00");
        expect(colorDataMargin(resultsArray["4"].colorData, [30, 100, 100])).toEqual(true);
        expect(resultsArray["4"].hex).toEqual("#FF8000");
        // Half saturated, half brightness color, wraparound from 0 hue
        resultsArray = colorUtils.getAnalogousColorFromHSBCenter([0, 50, 50], 20, 4);
        expect(colorDataMargin(resultsArray["1"].colorData, [330, 50, 50])).toEqual(true);
        expect(resultsArray["1"].hex).toEqual("#804060");
        expect(colorDataMargin(resultsArray["2"].colorData, [350, 50, 50])).toEqual(true);
        expect(resultsArray["2"].hex).toEqual("#80404A");
        expect(colorDataMargin(resultsArray["3"].colorData, [10, 50, 50])).toEqual(true);
        expect(resultsArray["3"].hex).toEqual("#804A40");
        expect(colorDataMargin(resultsArray["4"].colorData, [30, 50, 50])).toEqual(true);
        expect(resultsArray["4"].hex).toEqual("#806040");
        expect(Object.keys(resultsArray).length).toEqual(4);
    });
});
