import React from "react";
import * as colorUtils from "../src/ColorUtils.js";
import PalettePicker from "../src/PalettePicker";
import { shallow } from "enzyme";
import convert from "color-convert";

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

    it("Calculates four Reatangle colors from colorData as expected", () => {
        // Fully saturated color, no rotation
        let resultsArray = colorUtils.getRectangleColor(0, 70, 110, 100, 100);
        expect(resultsArray[1].colorData).toEqual([55, 100, 100]);
        expect(resultsArray[1].hex).toEqual("#FFEA00");
        expect(resultsArray[2].colorData).toEqual([125, 100, 100]);
        expect(resultsArray[2].hex).toEqual("#00FF15");
        expect(resultsArray[3].colorData).toEqual([235, 100, 100]);
        expect(resultsArray[3].hex).toEqual("#0015FF");
        expect(resultsArray[4].colorData).toEqual([305, 100, 100]);
        expect(resultsArray[4].hex).toEqual("#FF00EA");
        // Half saturated, half brightness color, no rotation
        resultsArray = colorUtils.getRectangleColor(0, 70, 110, 50, 50);
        expect(resultsArray[1].colorData).toEqual([55, 50, 50]);
        expect(resultsArray[1].hex).toEqual("#807A40");
        expect(resultsArray[2].colorData).toEqual([125, 50, 50]);
        expect(resultsArray[2].hex).toEqual("#408045");
        expect(resultsArray[3].colorData).toEqual([235, 50, 50]);
        expect(resultsArray[3].hex).toEqual("#404580");
        expect(resultsArray[4].colorData).toEqual([305, 50, 50]);
        expect(resultsArray[4].hex).toEqual("#80407A");
        // Fully saturated color, 50 rotation
        resultsArray = colorUtils.getRectangleColor(50, 70, 110, 100, 100);
        expect(resultsArray[1].colorData).toEqual([105, 100, 100]);
        expect(resultsArray[1].hex).toEqual("#40FF00");
        expect(resultsArray[2].colorData).toEqual([175, 100, 100]);
        expect(resultsArray[2].hex).toEqual("#00FFEA");
        expect(resultsArray[3].colorData).toEqual([285, 100, 100]);
        expect(resultsArray[3].hex).toEqual("#BF00FF");
        expect(resultsArray[4].colorData).toEqual([355, 100, 100]);
        expect(resultsArray[4].hex).toEqual("#FF0015");
        // Half saturated, half brightness color, 50 rotation
        resultsArray = colorUtils.getRectangleColor(50, 70, 110, 50, 50);
        expect(resultsArray[1].colorData).toEqual([105, 50, 50]);
        expect(resultsArray[1].hex).toEqual("#508040");
        expect(resultsArray[2].colorData).toEqual([175, 50, 50]);
        expect(resultsArray[2].hex).toEqual("#40807A");
        expect(resultsArray[3].colorData).toEqual([285, 50, 50]);
        expect(resultsArray[3].hex).toEqual("#704080");
        expect(resultsArray[4].colorData).toEqual([355, 50, 50]);
        expect(resultsArray[4].hex).toEqual("#804045");
        // Fully saturated color, 100 rotation
        resultsArray = colorUtils.getRectangleColor(100, 70, 110, 100, 100);
        expect(resultsArray[1].colorData).toEqual([155, 100, 100]);
        expect(resultsArray[1].hex).toEqual("#00FF95");
        expect(resultsArray[2].colorData).toEqual([225, 100, 100]);
        expect(resultsArray[2].hex).toEqual("#0040FF");
        expect(resultsArray[3].colorData).toEqual([335, 100, 100]);
        expect(resultsArray[3].hex).toEqual("#FF006A");
        expect(resultsArray[4].colorData).toEqual([45, 100, 100]);
        expect(resultsArray[4].hex).toEqual("#FFBF00");
        // Half saturated, half brightness color, 100 rotation
        resultsArray = colorUtils.getRectangleColor(100, 70, 110, 50, 50);
        expect(resultsArray[1].colorData).toEqual([155, 50, 50]);
        expect(resultsArray[1].hex).toEqual("#408065");
        expect(resultsArray[2].colorData).toEqual([225, 50, 50]);
        expect(resultsArray[2].hex).toEqual("#405080");
        expect(resultsArray[3].colorData).toEqual([335, 50, 50]);
        expect(resultsArray[3].hex).toEqual("#80405A");
        expect(resultsArray[4].colorData).toEqual([45, 50, 50]);
        expect(resultsArray[4].hex).toEqual("#807040");
    });
});

describe("WCAG Contrast checker accurately represents contrast ratio between two colors", () => {
    const isInMarginOfError = (numberOne, numberTwo, margin = 0.01) => {
        const ret = Math.abs(numberOne - numberTwo) < margin;
        return ret ? ret : `${numberOne} and ${numberTwo} are not within ${margin}`;
    };

    it("Accurately measures contrast in RGB colorMode", () => {
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFFFFF", colorData: [255, 255, 255] }, { hex: "#000000", colorData: [0, 0, 0] }, "RGB"), 21)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#000000", colorData: [0, 0, 0] }, { hex: "#FFFFFF", colorData: [255, 255, 255] }, "RGB"), 21)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFEA70", colorData: [255, 234, 112] }, { hex: "#4238FF", colorData: [66, 56, 255] }, "RGB"), 5.32)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFFFFF", colorData: [255, 255, 255] }, { hex: "#FFFFFF", colorData: [255, 255, 255] }, "RGB"), 1)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFC9FB", colorData: [255, 201, 251] }, { hex: "#87FFB5", colorData: [135, 255, 181] }, "RGB"), 1.13)).toEqual(true);
    });

    it("Accurately measures contrast in HSB colorMode", () => {
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFFFFF", colorData: [0, 0, 100] }, { hex: "#000000", colorData: [0, 0, 0] }, "HSB"), 21)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#000000", colorData: [0, 0, 0] }, { hex: "#FFFFFF", colorData: [0, 0, 100] }, "HSB"), 21)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFEA70", colorData: [51, 56, 100] }, { hex: "#4238FF", colorData: [243, 78, 100] }, "HSB"), 5.32)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFFFFF", colorData: [0, 0, 100] }, { hex: "#FFFFFF", colorData: [0, 0, 100] }, "HSB"), 1)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFC9FB", colorData: [304, 21, 100] }, { hex: "#87FFB5", colorData: [143, 47, 100] }, "HSB"), 1.13)).toEqual(true);
    });

    it("Accurately measures contrast in HSL colorMode", () => {
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFFFFF", colorData: [0, 0, 100] }, { hex: "#000000", colorData: [0, 0, 0] }, "HSL"), 21)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#000000", colorData: [0, 0, 0] }, { hex: "#FFFFFF", colorData: [0, 0, 100] }, "HSL"), 21)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFEA70", colorData: [51, 100, 72] }, { hex: "#4238FF", colorData: [243, 100, 61] }, "HSL"), 5.32)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFFFFF", colorData: [0, 0, 100] }, { hex: "#FFFFFF", colorData: [0, 0, 100] }, "HSL"), 1)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFC9FB", colorData: [304, 100, 89] }, { hex: "#87FFB5", colorData: [143, 100, 76] }, "HSL"), 1.13)).toEqual(true);
    });

    it("Accurately measures contrast in CMYK colorMode", () => {
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFFFFF", colorData: [0, 0, 0, 0] }, { hex: "#000000", colorData: [0, 0, 0, 100] }, "CMYK"), 21)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#000000", colorData: [0, 0, 0, 100] }, { hex: "#FFFFFF", colorData: [0, 0, 0, 0] }, "CMYK"), 21)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFEA70", colorData: [0, 8, 56, 0] }, { hex: "#4238FF", colorData: [74, 78, 0, 0] }, "CMYK"), 5.32)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFFFFF", colorData: [0, 0, 0, 0] }, { hex: "#FFFFFF", colorData: [0, 0, 0, 0] }, "CMYK"), 1)).toEqual(true);
        expect(isInMarginOfError(colorUtils.getWCAGContrast({ hex: "#FFC9FB", colorData: [0, 21, 2, 0] }, { hex: "#87FFB5", colorData: [47, 0, 29, 0] }, "CMYK"), 1.13)).toEqual(true);
    });
});

describe("getAbsoluteHueDiff returns correct hue diff", () => {
    expect(colorUtils.getAbsoluteHueDiff([359, 100, 100], [271, 100, 100])).toEqual(-88);
    expect(colorUtils.getAbsoluteHueDiff([360, 100, 100], [270, 100, 100])).toEqual(-90);
});

describe("Color randomizer correctly returns random colors within possible range", () => {
    const randomizer = colorUtils.getRandomColor;

    const expectToBeBetween = (x, min, max) => {
        if (!(x >= min && x < max)) {
            console.log(x, " is not between ", min, max);
        }
        expect(x >= min && x < max).toEqual(true);
    };

    it("Correctly assigns random colors without a section to guide", () => {
        const random1 = randomizer("HSB");
        const random1HSBConvert = convert.hex.hsv(random1.hex);

        // Small 5 value difference allowed to compensate for inaccurate hex codes
        expectToBeBetween(random1.colorData[0], 0, 360);
        expectToBeBetween(random1.colorData[1], 55, 80);
        expectToBeBetween(random1.colorData[2], 70, 95);

        expectToBeBetween(random1HSBConvert[0], 0, 360);
        expectToBeBetween(random1HSBConvert[1], 55, 80);
        expectToBeBetween(random1HSBConvert[2], 70, 95);

        const random2 = randomizer("HSB");
        const random2HSBConvert = convert.hex.hsv(random2.hex);

        expectToBeBetween(random2.colorData[0], 0, 360);
        expectToBeBetween(random2.colorData[1], 55, 80);
        expectToBeBetween(random2.colorData[2], 70, 95);

        expectToBeBetween(random2HSBConvert[0], 0, 360);
        expectToBeBetween(random2HSBConvert[1], 55, 80);
        expectToBeBetween(random2HSBConvert[2], 70, 95);

        const random3 = randomizer("HSB");
        const random3HSBConvert = convert.hex.hsv(random3.hex);

        expectToBeBetween(random3.colorData[0], 0, 360);
        expectToBeBetween(random3.colorData[1], 55, 80);
        expectToBeBetween(random3.colorData[2], 70, 95);

        expectToBeBetween(random3HSBConvert[0], 0, 360);
        expectToBeBetween(random3HSBConvert[1], 55, 80);
        expectToBeBetween(random3HSBConvert[2], 70, 95);

        const random4 = randomizer("HSB");
        const random4HSBConvert = convert.hex.hsv(random4.hex);

        expectToBeBetween(random4.colorData[0], 0, 360);
        expectToBeBetween(random4.colorData[1], 55, 80);
        expectToBeBetween(random4.colorData[2], 70, 95);

        expectToBeBetween(random4HSBConvert[0], 0, 360);
        expectToBeBetween(random4HSBConvert[1], 55, 80);
        expectToBeBetween(random4HSBConvert[2], 70, 95);
    });

    it("Correctly assigns weighted random colors with a section to guide", () => {
        const section = {
            "1": { hex: "#59B3B3", colorData: [180, 50, 70] },
            "2": { hex: "#52B8CC", colorData: [190, 60, 80] },
            "3": { hex: "#45B0E6", colorData: [200, 70, 90] },
        };

        const random1 = randomizer("HSB", section);
        const random1HSBConvert = convert.hex.hsv(random1.hex);

        expectToBeBetween(random1.colorData[0], 178, 202);
        expectToBeBetween(random1.colorData[1], 50, 70);
        expectToBeBetween(random1.colorData[2], 70, 90);

        expectToBeBetween(random1HSBConvert[0], 178, 202);
        expectToBeBetween(random1HSBConvert[1], 50, 70);
        expectToBeBetween(random1HSBConvert[2], 70, 90);

        const random2 = randomizer("HSB", section);
        const random2HSBConvert = convert.hex.hsv(random2.hex);

        expectToBeBetween(random2.colorData[0], 178, 202);
        expectToBeBetween(random2.colorData[1], 50, 70);
        expectToBeBetween(random2.colorData[2], 70, 90);

        expectToBeBetween(random2HSBConvert[0], 178, 202);
        expectToBeBetween(random2HSBConvert[1], 50, 70);
        expectToBeBetween(random2HSBConvert[2], 70, 90);

        const random3 = randomizer("HSB", section);
        const random3HSBConvert = convert.hex.hsv(random3.hex);

        expectToBeBetween(random3.colorData[0], 178, 202);
        expectToBeBetween(random3.colorData[1], 50, 70);
        expectToBeBetween(random3.colorData[2], 70, 90);

        expectToBeBetween(random3HSBConvert[0], 178, 202);
        expectToBeBetween(random3HSBConvert[1], 50, 70);
        expectToBeBetween(random3HSBConvert[2], 70, 90);

        const random4 = randomizer("HSB", section);
        const random4HSBConvert = convert.hex.hsv(random4.hex);

        expectToBeBetween(random4.colorData[0], 178, 202);
        expectToBeBetween(random4.colorData[1], 50, 70);
        expectToBeBetween(random4.colorData[2], 70, 90);

        expectToBeBetween(random4HSBConvert[0], 178, 202);
        expectToBeBetween(random4HSBConvert[1], 50, 70);
        expectToBeBetween(random4HSBConvert[2], 70, 90);

        const random5 = randomizer("HSB", section);
        const random5HSBConvert = convert.hex.hsv(random5.hex);

        expectToBeBetween(random5.colorData[0], 178, 202);
        expectToBeBetween(random5.colorData[1], 50, 70);
        expectToBeBetween(random5.colorData[2], 70, 90);

        expectToBeBetween(random5HSBConvert[0], 178, 202);
        expectToBeBetween(random5HSBConvert[1], 50, 70);
        expectToBeBetween(random5HSBConvert[2], 70, 90);
    });
});
