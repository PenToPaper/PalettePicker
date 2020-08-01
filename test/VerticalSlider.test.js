import React from "react";
import { shallow, mount } from "enzyme";
import VerticalSlider, { getPercentFilled } from "../src/VerticalSlider";
import { act } from "react-dom/test-utils";

// Don't make this bit accessible or test it for accessibility.
// It probably should be hidden from screen readers for now.
describe("Vertical Slider renders proper div based on props", () => {
    const sliderWrapper = shallow(<VerticalSlider divClass="brightness-vertical" value={10} thumbClass="brightness-thumb" onChange={() => {}} />);

    it("Renders the element properly", () => {
        expect(sliderWrapper.prop("className")).toEqual("brightness-vertical");
        expect(sliderWrapper.children("div").prop("className")).toEqual("brightness-thumb");
        expect(sliderWrapper.find(".brightness-thumb").prop("style").top).toEqual("10%");
    });
});

describe("Vertical Slider click and drag algorithm works outside of component", () => {
    it("getPercentFilled properly returns percent filled when provided with element height and mouse position relative to element", () => {
        expect(getPercentFilled(100, 50)).toEqual(0.5);
        expect(getPercentFilled(230, 50)).toEqual(50 / 230);
        expect(getPercentFilled(212, 236)).toEqual(1);
        expect(getPercentFilled(100, -1)).toEqual(0);
    });
});

describe("Vertical Slider click and drag algorithm works inside of component", () => {
    const callback = jest.fn();
    const sliderWrapper = mount(<VerticalSlider divClass="brightness-vertical" thumbClass="brightness-thumb" onChange={callback} />);

    const map = {};

    document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
    });

    document.removeEventListener = jest.fn((event, cb) => {
        if (map[event] === cb) {
            delete map[event];
        }
    });

    it("On mousedown, calls callback onChange and registers event handlers", () => {
        expect(Object.keys(map)).toHaveLength(0);
        sliderWrapper.find("div").at(0).prop("onMouseDown")({ clientY: 1 });
        expect(callback).toHaveBeenLastCalledWith(100);
        expect(Object.keys(map)).toHaveLength(2);
        expect(typeof map["mousemove"]).toEqual("function");
        expect(typeof map["mouseup"]).toEqual("function");
    });

    it("On mousemove, calls callback onPickColor", () => {
        map["mousemove"]({ clientY: -1 });
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith(0);
    });

    it("On mouseup, calls callback onPickColor and removes event handlers", () => {
        map["mouseup"]({ clientY: 1 });
        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenLastCalledWith(100);
        expect(Object.keys(map)).toHaveLength(0);
        expect(typeof map["mousemove"]).toEqual("undefined");
        expect(typeof map["mouseup"]).toEqual("undefined");
    });

    it("On touchstart, calls callback onPickColor and registers event handlers", () => {
        expect(Object.keys(map)).toHaveLength(0);
        sliderWrapper.find("div").at(0).prop("onTouchStart")({ touches: [{ pageY: -1 }], preventDefault: () => {} });
        expect(callback).toHaveBeenCalledTimes(4);
        expect(callback).toHaveBeenLastCalledWith(0);
        expect(Object.keys(map)).toHaveLength(2);
        expect(typeof map["touchmove"]).toEqual("function");
        expect(typeof map["touchend"]).toEqual("function");
    });

    it("On touchmove, calls callback onPickColor", () => {
        map["touchmove"]({ pageY: 1, preventDefault: () => {} });
        expect(callback).toHaveBeenCalledTimes(5);
        expect(callback).toHaveBeenLastCalledWith(100);
    });

    it("On touchend, calls callback onPickColor and removes event handlers", () => {
        map["touchend"]({ pageY: -1 });
        expect(callback).toHaveBeenCalledTimes(6);
        expect(callback).toHaveBeenLastCalledWith(0);
        expect(Object.keys(map)).toHaveLength(0);
        expect(typeof map["touchmove"]).toEqual("undefined");
        expect(typeof map["touchend"]).toEqual("undefined");
    });
});
