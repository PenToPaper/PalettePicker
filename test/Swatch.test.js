import React from "react";
import Swatch, { RgbModifier, HsbModifier, HslModifier, CmykModifier } from "../src/Swatch";
import { shallow, mount } from "enzyme";
import simulateKeyDown from "./SimulateKeyDown";

describe("Swatch renders default state correctly based on props", () => {
    const swatchWrapper = shallow(<Swatch selected={false} color={{ hex: "#663333", colorData: [0, 50, 40] }} onChange={() => {}} colorMode={"HSB"} />);

    it("Renders proper child elements", () => {
        // Swatch itself has aria-compatible attributes
        expect(swatchWrapper.find(".swatch").prop("tabIndex")).toEqual("0");
        expect(swatchWrapper.find(".swatch").prop("aria-selected")).toEqual(undefined);

        // h6
        expect(swatchWrapper.find("h6")).toHaveLength(1);
        expect(swatchWrapper.find("h6").text()).toEqual("#663333");
    });

    it("Renders proper color values for hsb on load", () => {
        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("HsbModifier")).toHaveLength(1);

        expect(swatchWrapper.find("HsbModifier").prop("color")).toEqual({ hex: "#663333", colorData: [0, 50, 40] });
        expect(typeof swatchWrapper.find("HsbModifier").prop("onChange")).toEqual("function");

        const hsbWrapper = shallow(<HsbModifier color={{ hex: "#663333", colorData: [0, 50, 40] }} onChange={() => {}} />);
        expect(hsbWrapper.find("Slider")).toHaveLength(3);
        expect(hsbWrapper.find({ wrapperClass: "hue-modifier" })).toHaveLength(1);
        expect(hsbWrapper.find({ wrapperClass: "saturation-modifier" })).toHaveLength(1);
        expect(hsbWrapper.find({ wrapperClass: "brightness-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(hsbWrapper.find({ wrapperClass: "hue-modifier" }).prop("value")).toEqual(0);
        expect(hsbWrapper.find({ wrapperClass: "saturation-modifier" }).prop("value")).toEqual(50);
        expect(hsbWrapper.find({ wrapperClass: "brightness-modifier" }).prop("value")).toEqual(40);
    });

    it("Renders proper hsb slider gradients on load", () => {
        const hsbWrapper = shallow(<HsbModifier color={{ hex: "#663333", colorData: [0, 50, 40] }} onChange={() => {}} />);

        expect(hsbWrapper.find({ wrapperClass: "saturation-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #666666, #660000)");
        expect(hsbWrapper.find({ wrapperClass: "brightness-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #000000, #FF8080)");
    });

    it("Changes to aria-selected=true when selected prop changes", () => {
        // Swatch itself has aria-compatible attributes
        swatchWrapper.setProps({ selected: true });
        expect(swatchWrapper.find(".swatch").prop("aria-selected")).toEqual("true");
    });

    it("Renders proper color values for rgb", () => {
        swatchWrapper.setProps({ colorMode: "RGB", color: { hex: "#663333", colorData: [102, 51, 51] } });

        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("RgbModifier")).toHaveLength(1);

        expect(swatchWrapper.find("RgbModifier").prop("color")).toEqual({ hex: "#663333", colorData: [102, 51, 51] });
        expect(typeof swatchWrapper.find("RgbModifier").prop("onChange")).toEqual("function");

        const rgbWrapper = shallow(<RgbModifier color={{ hex: "#663333", colorData: [102, 51, 51] }} onChange={() => {}} />);
        expect(rgbWrapper.find("Slider")).toHaveLength(3);
        expect(rgbWrapper.find({ wrapperClass: "red-modifier" })).toHaveLength(1);
        expect(rgbWrapper.find({ wrapperClass: "green-modifier" })).toHaveLength(1);
        expect(rgbWrapper.find({ wrapperClass: "blue-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(rgbWrapper.find({ wrapperClass: "red-modifier" }).prop("value")).toEqual(102);
        expect(rgbWrapper.find({ wrapperClass: "green-modifier" }).prop("value")).toEqual(51);
        expect(rgbWrapper.find({ wrapperClass: "blue-modifier" }).prop("value")).toEqual(51);
    });

    it("Renders proper rgb slider gradients", () => {
        const hsbWrapper = shallow(<RgbModifier color={{ hex: "#663333", colorData: [102, 51, 51] }} onChange={() => {}} />);

        expect(hsbWrapper.find({ wrapperClass: "red-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #003333, #FF3333)");
        expect(hsbWrapper.find({ wrapperClass: "green-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #660033, #66FF33)");
        expect(hsbWrapper.find({ wrapperClass: "blue-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #663300, #6633FF)");
    });

    it("Renders proper color values for hsl", () => {
        swatchWrapper.setProps({ colorMode: "HSL", color: { hex: "#663333", colorData: [0, 33, 30] } });

        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("HslModifier")).toHaveLength(1);

        expect(swatchWrapper.find("HslModifier").prop("color")).toEqual({ hex: "#663333", colorData: [0, 33, 30] });
        expect(typeof swatchWrapper.find("HslModifier").prop("onChange")).toEqual("function");

        const hslWrapper = shallow(<HslModifier color={{ hex: "#663333", colorData: [0, 33, 30] }} onChange={() => {}} />);
        expect(hslWrapper.find("Slider")).toHaveLength(3);
        expect(hslWrapper.find({ wrapperClass: "hue-modifier" })).toHaveLength(1);
        expect(hslWrapper.find({ wrapperClass: "saturation-modifier" })).toHaveLength(1);
        expect(hslWrapper.find({ wrapperClass: "lightness-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(hslWrapper.find({ wrapperClass: "hue-modifier" }).prop("value")).toEqual(0);
        expect(hslWrapper.find({ wrapperClass: "saturation-modifier" }).prop("value")).toEqual(33);
        expect(hslWrapper.find({ wrapperClass: "lightness-modifier" }).prop("value")).toEqual(30);
    });

    it("Renders proper hsl slider gradients", () => {
        const hsbWrapper = shallow(<HslModifier color={{ hex: "#663333", colorData: [0, 33, 30] }} onChange={() => {}} />);

        expect(hsbWrapper.find({ wrapperClass: "saturation-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #4D4D4D, #990000)");
        expect(hsbWrapper.find({ wrapperClass: "lightness-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #000000, #AA5555, #FFFFFF)");
    });

    it("Renders proper color values for cmyk", () => {
        swatchWrapper.setProps({ colorMode: "CMYK", color: { hex: "#663333", colorData: [0, 20, 20, 60] } });

        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("CmykModifier")).toHaveLength(1);

        expect(swatchWrapper.find("CmykModifier").prop("color")).toEqual({ hex: "#663333", colorData: [0, 20, 20, 60] });
        expect(typeof swatchWrapper.find("CmykModifier").prop("onChange")).toEqual("function");

        const cmykWrapper = shallow(<CmykModifier color={{ hex: "#663333", colorData: [0, 20, 20, 60] }} onChange={() => {}} />);
        expect(cmykWrapper.find("Slider")).toHaveLength(4);
        expect(cmykWrapper.find({ wrapperClass: "cyan-modifier" })).toHaveLength(1);
        expect(cmykWrapper.find({ wrapperClass: "magenta-modifier" })).toHaveLength(1);
        expect(cmykWrapper.find({ wrapperClass: "yellow-modifier" })).toHaveLength(1);
        expect(cmykWrapper.find({ wrapperClass: "key-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(cmykWrapper.find({ wrapperClass: "cyan-modifier" }).prop("value")).toEqual(0);
        expect(cmykWrapper.find({ wrapperClass: "magenta-modifier" }).prop("value")).toEqual(20);
        expect(cmykWrapper.find({ wrapperClass: "yellow-modifier" }).prop("value")).toEqual(20);
        expect(cmykWrapper.find({ wrapperClass: "key-modifier" }).prop("value")).toEqual(60);
    });

    it("Renders proper cmyk slider gradients", () => {
        const hsbWrapper = shallow(<CmykModifier color={{ hex: "#663333", colorData: [0, 50, 50, 60] }} onChange={() => {}} />);

        expect(hsbWrapper.find({ wrapperClass: "cyan-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #663333, #003333)");
        expect(hsbWrapper.find({ wrapperClass: "magenta-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #666633, #660033)");
        expect(hsbWrapper.find({ wrapperClass: "yellow-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #663366, #663300)");
        expect(hsbWrapper.find({ wrapperClass: "key-modifier" }).prop("style").backgroundImage).toEqual("linear-gradient(to right, #FF8080, #000000)");
    });
});

describe("Swatch changes color displayed and calls onColorChange callback when a slider is changed.", () => {
    // rgb = 102, 51, 51
    // hsb = 0, 50, 40
    let color = { hex: "#663333", colorData: [0, 50, 40] };
    const setColor = jest.fn((newColor) => {
        color = newColor;
    });
    const swatchWrapper = mount(<Swatch selected={true} color={color} onChange={setColor} colorMode={"HSB"} />);

    it("Properly recalculates hex color code based on hue slider change", () => {
        swatchWrapper.find(".hue-modifier .modifier-thumb").getDOMNode().focus();

        // increases hue by 10
        simulateKeyDown(swatchWrapper, ".hue-modifier .modifier-thumb", "page_up");

        swatchWrapper.update();

        expect(setColor).toHaveBeenCalled();
        expect(color).toEqual({ hex: "#663B33", colorData: [10, 50, 40] });

        swatchWrapper.setProps({ colorMode: "HSB", color });

        expect(swatchWrapper.find("h6").text()).toEqual("#663B33");
        // Would normally be 10, but there is no hex color to properly represent hsb(9, 0.5, 0.4)
        expect(swatchWrapper.find("span").first().text()).toEqual("10");

        expect(swatchWrapper.find(".swatch").prop("style")).toHaveProperty("backgroundColor");
        expect(swatchWrapper.find(".swatch").prop("style").backgroundColor).toEqual("#663B33");
    });
});

describe("Swatch properly handles optional delete swatch functionality", () => {
    const swatchWrapper = mount(<Swatch selected={true} color={{ hex: "#663333", colorData: [0, 50, 40] }} onColorChange={() => {}} colorMode={"HSB"} />);

    it("Does not render the button if deleteButton is false or not present", () => {
        expect(swatchWrapper.find("button")).toHaveLength(0);
    });

    it("Does render the button if deleteButton is true", () => {
        const callback = jest.fn();

        swatchWrapper.setProps({ deleteButton: true, onDeleteSwatch: callback });

        // Delete swatch button appears
        expect(swatchWrapper.find("button")).toHaveLength(1);
        expect(swatchWrapper.find("button").prop("aria-label")).toEqual("Delete Swatch");

        // Delete swatch button is clickable
        const clickEvent = { stopPropagation: jest.fn() };
        swatchWrapper.find("button").prop("onClick")(clickEvent);

        expect(clickEvent.stopPropagation).toHaveBeenCalled();
        expect(callback).toHaveBeenCalled();
    });
});

describe("Swatch calls onSelect prop onClick and on focus-enter", () => {
    const callback = jest.fn();
    const swatchWrapper = mount(<Swatch selected={true} color={{ hex: "#663333", colorData: [0, 50, 40] }} onColorChange={() => {}} colorMode={"HSB"} onSelect={callback} />);

    it("Calls onSelect on click", () => {
        swatchWrapper.find(".swatch").prop("onClick")();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("Calls onSelect on focus-enter", () => {
        swatchWrapper.find(".swatch").prop("onKeyDown")({ keyCode: 13, target: { classList: { contains: () => true } } });
        expect(callback).toHaveBeenCalledTimes(2);
        swatchWrapper.find(".swatch").prop("onKeyDown")({ keyCode: 13, target: { classList: { contains: () => false } } });
        expect(callback).toHaveBeenCalledTimes(2);
        swatchWrapper.find(".swatch").prop("onKeyDown")({ keyCode: 12, target: { classList: { contains: () => true } } });
        expect(callback).toHaveBeenCalledTimes(2);
    });
});
