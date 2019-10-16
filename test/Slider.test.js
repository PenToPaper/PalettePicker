import React from "react";
import Slider from "../src/Slider";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";

describe("Slider renders default state properly based on props", () => {
    const sliderWrapper = shallow(<Slider wrapperClass="hue-modifier" innerClass="modifier-thumb" max={360} min={0} default={0} pageIncrement={10} innerLabel="Hue" onChange={() => {}} />);

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

describe("Slider changes inner value based on keyboard interactions", () => {
    const callback = jest.fn();
    const sliderWrapper = mount(<Slider wrapperClass="hue-modifier" innerClass="modifier-thumb" max={360} min={0} default={0} pageIncrement={10} innerLabel="Hue" onChange={callback} />);

    const simulateKeyDown = (elementName, key) => {
        let keyCode = 0;
        switch (key) {
            case "end":
                keyCode = 35;
                break;
            case "home":
                keyCode = 36;
                break;
            case "arrow_down":
                keyCode = 40;
                break;
            case "arrow_up":
                keyCode = 38;
                break;
            case "arrow_left":
                keyCode = 37;
                break;
            case "arrow_right":
                keyCode = 39;
                break;
            case "page_up":
                keyCode = 33;
                break;
            case "page_down":
                keyCode = 34;
                break;
        }
        act(() => {
            sliderWrapper.find(elementName).simulate("keydown", { keyCode, key });
        });
    };

    const expectSliderValue = expectedValue => {
        expect(callback).toHaveBeenCalled();
        expect(sliderWrapper.find(".modifier-thumb").prop("style")).toHaveProperty("left");
        expect(sliderWrapper.find(".modifier-thumb").prop("aria-valuenow")).toEqual(String(expectedValue));
    };

    sliderWrapper
        .find(".modifier-thumb")
        .getDOMNode()
        .focus();

    it("Increments slider value one step using right arrow key", () => {
        simulateKeyDown(".modifier-thumb", "arrow_right");
        sliderWrapper.update();

        expectSliderValue(1);
    });

    it("Increments slider value one step using up arrow key", () => {
        simulateKeyDown(".modifier-thumb", "arrow_up");
        sliderWrapper.update();

        expectSliderValue(2);
    });

    it("Decrements slider value one step using left arrow key", () => {
        simulateKeyDown(".modifier-thumb", "arrow_left");
        sliderWrapper.update();

        expectSliderValue(1);
    });

    it("Decrements slider value one step using down arrow key", () => {
        simulateKeyDown(".modifier-thumb", "arrow_down");
        sliderWrapper.update();

        expectSliderValue(0);
    });

    it("Increases slider value by pageIncrement prop on page up", () => {
        simulateKeyDown(".modifier-thumb", "page_up");
        sliderWrapper.update();

        expectSliderValue(10);
    });

    it("Decreases slider value by pageIncrement prop on page down", () => {
        simulateKeyDown(".modifier-thumb", "page_down");
        sliderWrapper.update();

        expectSliderValue(0);
    });

    it("Increases slider value to max prop on end", () => {
        simulateKeyDown(".modifier-thumb", "end");
        sliderWrapper.update();

        expectSliderValue(360);
    });

    it("Decreases slider value to min prop on home", () => {
        simulateKeyDown(".modifier-thumb", "home");
        sliderWrapper.update();

        expectSliderValue(0);
    });
});
