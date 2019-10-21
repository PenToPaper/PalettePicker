import React from "react";
import { shallow, mount } from "enzyme";
import HueSaturationCircle, { getSaturation, getHue, getOffsetFromCenter } from "../src/HueSaturationCircle";
import HueSaturationNode, { getCoordinateFromHueSaturation } from "../src/HueSaturationNode";

describe("HueSaturationCircle is able to calculate the hue and saturation of a given point on the circle", () => {
    it("Correctly calculates offset from center based on offset from element and size of element", () => {
        // getOffsetFromCenter(radius, xOffset, yOffset)
        expect(getOffsetFromCenter(100, 100, 100)).toEqual([0, 0]);
        expect(getOffsetFromCenter(100, 30, 120)).toEqual([-70, -20]);
        expect(getOffsetFromCenter(100, 20, 160)).toEqual([-80, -60]);
        expect(getOffsetFromCenter(100, 110, 30)).toEqual([10, 70]);
        expect(getOffsetFromCenter(100, 120, 50)).toEqual([20, 50]);
        expect(getOffsetFromCenter(100, 0, 0)).toEqual([-100, 100]);
    });

    it("Correctly calculates hue based on radius = 100", () => {
        // getHue(radius, xOffsetFromCenter, yOffsetFromCenter)
        expect(getHue(100, 50, 50)).toEqual(45);
        expect(getHue(100, 32, 60)).toEqual(62);
        expect(getHue(100, 100, 0)).toEqual(0);
        expect(getHue(100, -10, 40)).toEqual(-76);
        expect(getHue(100, -50, 20)).toEqual(-22);
    });

    it("Correctly calculates saturation based on radius = 100", () => {
        expect(getSaturation(100, 50, 50)).toEqual(71);
        expect(getSaturation(100, 32, 60)).toEqual(68);
        expect(getSaturation(100, 100, 0)).toEqual(100);
        expect(getSaturation(100, -10, 40)).toEqual(41);
        expect(getSaturation(100, -50, 20)).toEqual(54);

        // VERY IMPORTANT EDGE CASE
        expect(getSaturation(100, 100, 100)).toEqual(100);
    });
});

describe("HueSaturationCircle calls callback function on click and generates circle elements when supplied with swatches", () => {
    const callback = jest.fn();
    const swatchData = {
        10: "#aaaaaa",
        2: "#aaabbb",
        13: "#aaaccc"
    };
    const circleWrapper = mount(<HueSaturationCircle onPickColor={callback} swatches={swatchData} />);

    it("Calls callback onPickColor", () => {
        circleWrapper.find(".hue-saturation-circle").simulate("click");
        expect(callback).toHaveBeenCalled();
    });

    it("Creates 3 circle elements when supplied with the swatch data", () => {
        expect(circleWrapper.find("HueSaturationNode")).toHaveLength(3);
        expect(circleWrapper.find({ color: "#aaaaaa" })).toHaveLength(1);
        expect(circleWrapper.find({ color: "#aaabbb" })).toHaveLength(1);
        expect(circleWrapper.find({ color: "#aaaccc" })).toHaveLength(1);
    });
});
