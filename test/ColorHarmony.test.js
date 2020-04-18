import React from "react";
import { getComplementaryColorFromHex, getComplementaryColorFromColorData } from "../src/ColorUtils.js";
import PalettePicker from "../src/PalettePicker";
import { shallow } from "enzyme";

describe("Algorithms for finding color harmonies function correctly", () => {
    it("Calculates single complementary color from hex as expected", () => {
        // Fully saturated color, wraparound from 270 hue to 90 hue
        expect(getComplementaryColorFromHex("#7F00FF").hex).toEqual("#80FF00");
        // Half saturated color, wraparound from 270 hue to 90 hue
        expect(getComplementaryColorFromHex("#BF7FFF").hex).toEqual("#BFFF7F");
        // Fully saturated color, no wraparound from 90 hue to 270 hue
        expect(getComplementaryColorFromHex("#81FF00").hex).toEqual("#7E00FF");
        // Half saturated color, no wraparound from 90 hue to 270 hue
        expect(getComplementaryColorFromHex("#C0FF7F").hex).toEqual("#BE7FFF");
        // Half saturated, half brightness color, wraparound from 270 hue to 90 hue
        expect(getComplementaryColorFromHex("#5F3F7F").hex).toEqual("#5F7F3F");
        // Half saturated, half brightness color, no wraparound from 90 hue to 270 hue
        expect(getComplementaryColorFromHex("#5F7F3F").hex).toEqual("#5F3F7F");
    });

    it("Calculates single complementary color from colorData as expected", () => {
        // Fully saturated color, wraparound from 270 hue to 90 hue
        expect(getComplementaryColorFromColorData([270, 100, 100]).colorData).toEqual([90, 100, 100]);
        expect(getComplementaryColorFromColorData([270, 100, 100]).hex).toEqual("#80FF00");
        // Half saturated color, wraparound from 270 hue to 90 hue
        expect(getComplementaryColorFromColorData([270, 50, 100]).colorData).toEqual([90, 50, 100]);
        expect(getComplementaryColorFromColorData([270, 50, 100]).hex).toEqual("#BFFF80");
        // Fully saturated color, no wraparound from 90 hue to 270 hue
        expect(getComplementaryColorFromColorData([90, 100, 100]).colorData).toEqual([270, 100, 100]);
        expect(getComplementaryColorFromColorData([90, 100, 100]).hex).toEqual("#8000FF");
        // Half saturated color, no wraparound from 90 hue to 270 hue
        expect(getComplementaryColorFromColorData([90, 50, 100]).colorData).toEqual([270, 50, 100]);
        expect(getComplementaryColorFromColorData([90, 50, 100]).hex).toEqual("#BF80FF");
        // Half saturated, half brightness color, wraparound from 270 hue to 90 hue
        expect(getComplementaryColorFromColorData([270, 50, 50]).colorData).toEqual([90, 50, 50]);
        expect(getComplementaryColorFromColorData([270, 50, 50]).hex).toEqual("#608040");
        // Half saturated, half brightness color, no wraparound from 90 hue to 270 hue
        expect(getComplementaryColorFromColorData([90, 50, 50]).colorData).toEqual([270, 50, 50]);
        expect(getComplementaryColorFromColorData([90, 50, 50]).hex).toEqual("#604080");
    });
});
