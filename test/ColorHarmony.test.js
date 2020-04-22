import React from "react";
import * as colorUtils from "../src/ColorUtils.js";
import PalettePicker from "../src/PalettePicker";
import { shallow } from "enzyme";

describe("Algorithms for finding color harmonies function correctly", () => {
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

    it("Calculates two Triad colors from colorData as expected", () => {
        // Fully saturated color, no wraparound from 80 hue to 200 hue to 320 hue
        let resultsArray = colorUtils.getTriadColorFromHex("#AAFF00");
        expect(resultsArray[0].colorData).toEqual([200, 100, 100]);
        expect(resultsArray[0].hex).toEqual("#00AAFF");
        expect(resultsArray[1].colorData).toEqual([320, 100, 100]);
        expect(resultsArray[1].hex).toEqual("#FF00AA");
        // Fully saturated color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromHex("#00FF15");
        resultsArray[0].colorData = resultsArray[0].colorData.map(Math.round);
        resultsArray[1].colorData = resultsArray[1].colorData.map(Math.round);
        expect(resultsArray[0].colorData).toEqual([245, 100, 100]);
        expect(resultsArray[0].hex).toEqual("#1500FF");
        expect(resultsArray[1].colorData).toEqual([5, 100, 100]);
        expect(resultsArray[1].hex).toEqual("#FF1500");
        // Half saturated color, no wraparound from 80 hue to 200 hue to 320 hue
        resultsArray = colorUtils.getTriadColorFromHex("#D5FF80");
        resultsArray[0].colorData = resultsArray[0].colorData.map(Math.round);
        resultsArray[1].colorData = resultsArray[1].colorData.map(Math.round);
        expect(resultsArray[0].colorData).toEqual([200, 50, 100]);
        expect(resultsArray[0].hex).toEqual("#80D5FF");
        expect(resultsArray[1].colorData).toEqual([320, 50, 100]);
        expect(resultsArray[1].hex).toEqual("#FF80D5");
        // Half saturated color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromHex("#80FF8A");
        resultsArray[0].colorData = resultsArray[0].colorData.map(Math.round);
        resultsArray[1].colorData = resultsArray[1].colorData.map(Math.round);
        expect(resultsArray[0].colorData).toEqual([245, 50, 100]);
        expect(resultsArray[0].hex).toEqual("#8A80FF");
        expect(resultsArray[1].colorData).toEqual([5, 50, 100]);
        expect(resultsArray[1].hex).toEqual("#FF8A80");
        // Half saturated + half brightness color, no wraparound from 80 hue to 200 hue to 320 hue
        resultsArray = colorUtils.getTriadColorFromHex("#6A8040");
        resultsArray[0].colorData = resultsArray[0].colorData.map(Math.floor);
        resultsArray[1].colorData = resultsArray[1].colorData.map(Math.floor);
        expect(resultsArray[0].colorData).toEqual([200, 50, 50]);
        expect(resultsArray[0].hex).toEqual("#406A80");
        expect(resultsArray[1].colorData).toEqual([320, 50, 50]);
        expect(resultsArray[1].hex).toEqual("#80406A");
        // Half saturated + half brightness color, wraparound from 125 hue to 245 hue to 5 hue
        resultsArray = colorUtils.getTriadColorFromHex("#408045");
        resultsArray[0].colorData = resultsArray[0].colorData.map(Math.round);
        resultsArray[1].colorData = resultsArray[1].colorData.map(Math.round);
        expect(resultsArray[0].colorData).toEqual([245, 50, 50]);
        expect(resultsArray[0].hex).toEqual("#454080");
        expect(resultsArray[1].colorData).toEqual([5, 50, 50]);
        expect(resultsArray[1].hex).toEqual("#804540");
    });
});
