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
        expect(getHue(100, 100, 0)).toEqual(360);
        expect(getHue(100, -10, 40)).toEqual(104);
        expect(getHue(100, -50, 20)).toEqual(158);
        expect(getHue(100, -50, -50)).toEqual(225);
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
    const onSelectSwatch = jest.fn();
    const onNewColor = jest.fn();

    const swatchData = {
        Main: {
            2: { hex: "#aaabbb", colorData: [236, 9, 73] },
            10: { hex: "#aaaaaa", colorData: [0, 0, 67] },
            13: { hex: "#aaaccc", colorData: [236, 17, 80] },
        },
    };
    const circleWrapper = mount(<HueSaturationCircle onSelectSwatch={onSelectSwatch} selection={{ sectionName: "Main", index: 2 }} colorMode={"HSB"} onPickColor={onNewColor} swatches={swatchData} />);

    const map = {};
    document.addEventListener = jest.fn((event, callback) => {
        map[event] = callback;
    });
    document.removeEventListener = jest.fn((event, callback) => {
        delete map[event];
    });

    it("On mouseDown, calls callback onPickColor and registers event handlers", () => {
        expect(Object.keys(map)).toHaveLength(0);
        circleWrapper.find(".hue-saturation-circle").prop("onMouseDown")({ clientX: 1, clientY: 1 });
        expect(onSelectSwatch).toHaveBeenLastCalledWith({ sectionName: "Main", index: "2" });
        expect(onNewColor).toHaveBeenCalledTimes(1);
        expect(onNewColor).toHaveBeenLastCalledWith(315, 100, { sectionName: "Main", index: "2" });
        expect(Object.keys(map)).toHaveLength(2);
        expect(typeof map["mousemove"]).toEqual("function");
        expect(typeof map["mouseup"]).toEqual("function");
    });

    it("On mousemove, calls callback onPickColor", () => {
        map["mousemove"]({ clientX: -1, clientY: -1 });
        expect(onNewColor).toHaveBeenCalledTimes(2);
        expect(onNewColor).toHaveBeenLastCalledWith(135, 100, { sectionName: "Main", index: "2" });
    });

    it("On mouseup, calls callback onPickColor and removes event handlers", () => {
        map["mouseup"]({ clientX: 1, clientY: -1 });
        expect(onNewColor).toHaveBeenCalledTimes(3);
        expect(onNewColor).toHaveBeenLastCalledWith(45, 100, { sectionName: "Main", index: "2" });
        expect(Object.keys(map)).toHaveLength(0);
        expect(typeof map["mousemove"]).toEqual("undefined");
        expect(typeof map["mouseup"]).toEqual("undefined");
    });

    it("On touchstart, calls callback onPickColor and registers event handlers", () => {
        expect(Object.keys(map)).toHaveLength(0);
        circleWrapper.find(".hue-saturation-circle").prop("onTouchStart")({ touches: [{ pageX: 1, pageY: 1 }], preventDefault: () => {} });
        expect(onSelectSwatch).toHaveBeenLastCalledWith({ sectionName: "Main", index: "2" });
        expect(onNewColor).toHaveBeenCalledTimes(4);
        expect(onNewColor).toHaveBeenLastCalledWith(315, 100, { sectionName: "Main", index: "2" });
        expect(Object.keys(map)).toHaveLength(2);
        expect(typeof map["touchmove"]).toEqual("function");
        expect(typeof map["touchend"]).toEqual("function");
    });

    it("On touchmove, calls callback onPickColor", () => {
        map["touchmove"]({ pageX: -1, pageY: -1, preventDefault: () => {} });
        expect(onNewColor).toHaveBeenCalledTimes(5);
        expect(onNewColor).toHaveBeenLastCalledWith(135, 100, { sectionName: "Main", index: "2" });
    });

    it("On touchend, calls callback onPickColor and removes event handlers", () => {
        map["touchend"]({ pageX: 1, pageY: -1 });
        expect(onNewColor).toHaveBeenCalledTimes(6);
        expect(onNewColor).toHaveBeenLastCalledWith(45, 100, { sectionName: "Main", index: "2" });
        expect(Object.keys(map)).toHaveLength(0);
        expect(typeof map["touchmove"]).toEqual("undefined");
        expect(typeof map["touchend"]).toEqual("undefined");
    });

    it("Creates 3 circle elements when supplied with the swatch data", () => {
        expect(circleWrapper.find("HueSaturationNode")).toHaveLength(3);
        expect(circleWrapper.find("HueSaturationNode").get(2).props.color.hex).toEqual("#aaabbb");
        expect(circleWrapper.find("HueSaturationNode").get(1).props.color.hex).toEqual("#aaaaaa");
        expect(circleWrapper.find("HueSaturationNode").get(0).props.color.hex).toEqual("#aaaccc");
    });
});
