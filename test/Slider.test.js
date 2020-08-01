import React from "react";
import Slider, { getPercentFilled } from "../src/Slider";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import simulateKeyDown from "./SimulateKeyDown";

describe("Slider renders default state properly based on props", () => {
    const sliderWrapper = shallow(<Slider wrapperClass="hue-modifier" innerClass="modifier-thumb" max={360} min={0} value={0} pageIncrement={10} innerLabel="Hue" onChange={() => {}} />);

    it("Assigns the correct class to the root div", () => {
        expect(sliderWrapper.find(".hue-modifier")).toHaveLength(1);
    });

    it("Assigns correct properties to inner div", () => {
        expect(sliderWrapper.find(".modifier-thumb")).toHaveLength(1);
        expect(sliderWrapper.find(".modifier-thumb").prop("role")).toEqual("slider");
        expect(sliderWrapper.find(".modifier-thumb").prop("tabIndex")).toEqual("0");
        expect(sliderWrapper.find(".modifier-thumb").prop("aria-valuemax")).toEqual("360");
        expect(sliderWrapper.find(".modifier-thumb").prop("aria-valuemin")).toEqual("0");
        expect(sliderWrapper.find(".modifier-thumb").prop("aria-valuenow")).toEqual("0");
        expect(sliderWrapper.find(".modifier-thumb").prop("aria-label")).toEqual("Hue");
    });
});

describe("Click and drag calculations are made correctly", () => {
    expect(getPercentFilled(100, 50)).toEqual(0.5);
    expect(getPercentFilled(230, 50)).toEqual(50 / 230);
    expect(getPercentFilled(212, 236)).toEqual(1);
    expect(getPercentFilled(100, -1)).toEqual(0);
});

describe("Slider changes inner value based on keyboard interactions", () => {
    let value = 0;
    const callback = jest.fn((newValue) => {
        value = newValue;
        sliderWrapper.setProps({ value: value });
    });
    const sliderWrapper = mount(<Slider wrapperClass="hue-modifier" innerClass="modifier-thumb" max={360} min={0} value={value} pageIncrement={10} innerLabel="Hue" onChange={callback} />);

    const expectSliderValue = (expectedValue) => {
        expect(callback).toHaveBeenCalled();
        expect(sliderWrapper.find(".modifier-thumb").prop("style")).toHaveProperty("left");
        expect(sliderWrapper.find(".modifier-thumb").prop("aria-valuenow")).toEqual(String(expectedValue));
    };

    sliderWrapper.find(".modifier-thumb").getDOMNode().focus();

    it("Increments slider value one step using right arrow key", () => {
        simulateKeyDown(sliderWrapper, ".modifier-thumb", "arrow_right");
        sliderWrapper.update();

        expectSliderValue(1);
    });

    it("Increments slider value one step using up arrow key", () => {
        simulateKeyDown(sliderWrapper, ".modifier-thumb", "arrow_up");
        sliderWrapper.update();

        expectSliderValue(2);
    });

    it("Decrements slider value one step using left arrow key", () => {
        simulateKeyDown(sliderWrapper, ".modifier-thumb", "arrow_left");
        sliderWrapper.update();

        expectSliderValue(1);
    });

    it("Decrements slider value one step using down arrow key", () => {
        simulateKeyDown(sliderWrapper, ".modifier-thumb", "arrow_down");
        sliderWrapper.update();

        expectSliderValue(0);
    });

    it("Increases slider value by pageIncrement prop on page up", () => {
        simulateKeyDown(sliderWrapper, ".modifier-thumb", "page_up");
        sliderWrapper.update();

        expectSliderValue(10);
    });

    it("Decreases slider value by pageIncrement prop on page down", () => {
        simulateKeyDown(sliderWrapper, ".modifier-thumb", "page_down");
        sliderWrapper.update();

        expectSliderValue(0);
    });

    it("Increases slider value to max prop on end", () => {
        simulateKeyDown(sliderWrapper, ".modifier-thumb", "end");
        sliderWrapper.update();

        expectSliderValue(360);
    });

    it("Decreases slider value to min prop on home", () => {
        simulateKeyDown(sliderWrapper, ".modifier-thumb", "home");
        sliderWrapper.update();

        expectSliderValue(0);
    });
});

describe("Slider changes value based on mouse interactions", () => {
    const callback = jest.fn();
    const sliderWrapper = mount(<Slider wrapperClass="hue-modifier" innerClass="modifier-thumb" max={360} min={0} value={0} pageIncrement={10} innerLabel="Hue" onChange={callback} />);

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
        sliderWrapper.find("div").at(0).prop("onMouseDown")({ clientX: 1 });
        expect(callback).toHaveBeenLastCalledWith(360);
        expect(Object.keys(map)).toHaveLength(2);
        expect(typeof map["mousemove"]).toEqual("function");
        expect(typeof map["mouseup"]).toEqual("function");
    });

    it("On mousemove, calls callback onPickColor", () => {
        map["mousemove"]({ clientX: -1 });
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith(0);
    });

    it("On mouseup, calls callback onPickColor and removes event handlers", () => {
        map["mouseup"]({ clientX: 1 });
        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenLastCalledWith(360);
        expect(Object.keys(map)).toHaveLength(0);
        expect(typeof map["mousemove"]).toEqual("undefined");
        expect(typeof map["mouseup"]).toEqual("undefined");
    });

    it("On touchstart, calls callback onPickColor and registers event handlers", () => {
        expect(Object.keys(map)).toHaveLength(0);
        sliderWrapper.find("div").at(0).prop("onTouchStart")({ touches: [{ pageX: -1 }], preventDefault: () => {} });
        expect(callback).toHaveBeenCalledTimes(4);
        expect(callback).toHaveBeenLastCalledWith(0);
        expect(Object.keys(map)).toHaveLength(2);
        expect(typeof map["touchmove"]).toEqual("function");
        expect(typeof map["touchend"]).toEqual("function");
    });

    it("On touchmove, calls callback onPickColor", () => {
        map["touchmove"]({ pageX: 1, preventDefault: () => {} });
        expect(callback).toHaveBeenCalledTimes(5);
        expect(callback).toHaveBeenLastCalledWith(360);
    });

    it("On touchend, calls callback onPickColor and removes event handlers", () => {
        map["touchend"]({ pageX: -1 });
        expect(callback).toHaveBeenCalledTimes(6);
        expect(callback).toHaveBeenLastCalledWith(0);
        expect(Object.keys(map)).toHaveLength(0);
        expect(typeof map["touchmove"]).toEqual("undefined");
        expect(typeof map["touchend"]).toEqual("undefined");
    });
});
