import React from "react";
import { shallow, mount } from "enzyme";
import VerticalSlider, { getPercentFilled } from "../src/VerticalSlider";
import { act } from "react-dom/test-utils";

// Don't make this bit accessible or test it for accessibility.
// It probably should be hidden from screen readers for now.
describe("Vertical Slider renders proper div based on props", () => {
    const sliderWrapper = shallow(<VerticalSlider divClass="brightness-vertical" thumbClass="brightness-thumb" onChange={() => {}} />);

    it("Renders the element properly", () => {
        expect(sliderWrapper.prop("className")).toEqual("brightness-vertical");
        expect(sliderWrapper.children("div").prop("className")).toEqual("brightness-thumb");
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

    it("Increases slider value based on click and drag", () => {
        act(() => {
            sliderWrapper.find(".brightness-vertical").prop("onMouseDown")({ clientY: 0 });
            map.mousemove({ clientY: 10 });
            map.mouseup({ clientY: 10 });
        });

        sliderWrapper.update();

        expect(callback).toHaveBeenCalled();
    });

    it("Unbinds event handlers from the dom after mouseup", () => {
        expect(map).not.toHaveProperty("mousemove");
        expect(map).not.toHaveProperty("mouseup");
    });
});
