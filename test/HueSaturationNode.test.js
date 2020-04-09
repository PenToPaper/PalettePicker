import React from "react";
import { shallow } from "enzyme";
import HueSaturationNode, { getCoordinateFromHueSaturation } from "../src/HueSaturationNode";

describe("HueSaturationNode calculates its position properly", () => {
    it("Properly calcualtes its coordinates based on a coordinate plane", () => {
        expect(getCoordinateFromHueSaturation(100, 236, 17)).toEqual([-10, -14]);
        expect(getCoordinateFromHueSaturation(200, 236, 17)).toEqual([-19, -28]);

        expect(getCoordinateFromHueSaturation(200, 45, 10)).toEqual([14, 14]);
        expect(getCoordinateFromHueSaturation(200, 150, 17)).toEqual([-29, 17]);
    });

    it("Properly calculates its coordinates based on the DOM circle radius, radius = 100", () => {
        const circleNodeOne = shallow(<HueSaturationNode circleRadius={100} color={{ hex: "#aaaccc", colorData: [236, 17, 80] }} />);
        // #aaaccc = hsb(236, 17, 80)
        // hsb(236, 17, 80), radius 100 = (-14, -10) on a coordinate plane
        // (-14, -9.5) on a coordinate plane = (100 - 14, 100 - (-10)) with css coordinates with origin in top left
        expect(circleNodeOne.find(".hue-saturation-node").prop("style").left).toEqual("90px");
        expect(circleNodeOne.find(".hue-saturation-node").prop("style").top).toEqual("114px");
    });

    it("Properly calculates its coordinates based on the DOM circle radius, radius = 200", () => {
        const circleNodeOne = shallow(<HueSaturationNode circleRadius={200} color={{ hex: "#aaaccc", colorData: [236, 17, 80] }} />);
        // #aaaccc = hsb(236, 17, 80)
        // hsb(236, 17, 80), radius 100 = (-14, -10) on a coordinate plane
        // (-14, -9.5) on a coordinate plane = (100 - 14, 100 - (-10)) with css coordinates with origin in top left
        expect(circleNodeOne.find(".hue-saturation-node").prop("style").left).toEqual("181px");
        expect(circleNodeOne.find(".hue-saturation-node").prop("style").top).toEqual("228px");
    });

    it("Displays current color in background-color css property", () => {
        const circleNodeOne = shallow(<HueSaturationNode circleRadius={200} color={{ hex: "#aaaccc", colorData: [236, 17, 80] }} />);
        expect(circleNodeOne.find(".hue-saturation-node").prop("style").backgroundColor).toEqual("#aaaccc");
    });
});
