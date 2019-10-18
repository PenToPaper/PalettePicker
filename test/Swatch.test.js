import React from "react";
import Swatch from "../src/Swatch";
import { shallow, mount } from "enzyme";
import simulateKeyDown from "./SimulateKeyDown";

describe("Swatch renders default state correctly based on props", () => {
    const swatchWrapper = shallow(<Swatch selected={false} color="#663333" onColorChange={() => {}} colorMode={"hsb"} />);

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
        expect(swatchWrapper.find("Slider")).toHaveLength(3);
        expect(swatchWrapper.find({ wrapperClass: "hue-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "saturation-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "brightness-modifier" })).toHaveLength(1);

        // Displays correct hsb color code
        expect(swatchWrapper.find({ wrapperClass: "hue-modifier" }).prop("default")).toEqual(0);
        expect(swatchWrapper.find({ wrapperClass: "saturation-modifier" }).prop("default")).toEqual(50);
        expect(swatchWrapper.find({ wrapperClass: "brightness-modifier" }).prop("default")).toEqual(40);
    });

    it("Changes to aria-selected=true when selected prop changes", () => {
        // Swatch itself has aria-compatible attributes
        swatchWrapper.setProps({ selected: true });
        expect(swatchWrapper.find(".swatch").prop("aria-selected")).toEqual("true");
    });

    it("Displays new sliders and converts correctly to rgb", () => {
        // Color #663333
        // rgb = 102, 51, 51

        // Displays correct color sliders
        swatchWrapper.setProps({ colorMode: "rgb", color: "#663333" });

        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("Slider")).toHaveLength(3);
        expect(swatchWrapper.find({ wrapperClass: "red-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "green-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "blue-modifier" })).toHaveLength(1);

        // Displays correct rgb color code
        expect(swatchWrapper.find({ wrapperClass: "red-modifier" }).prop("default")).toEqual(102);
        expect(swatchWrapper.find({ wrapperClass: "green-modifier" }).prop("default")).toEqual(51);
        expect(swatchWrapper.find({ wrapperClass: "blue-modifier" }).prop("default")).toEqual(51);
    });

    it("Displays new sliders and converts correctly to hsl", () => {
        // Color #663333
        // hsl = 0, 33, 30

        // Displays correct color sliders
        swatchWrapper.setProps({ colorMode: "hsl", color: "#663333" });

        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("Slider")).toHaveLength(3);
        expect(swatchWrapper.find({ wrapperClass: "hue-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "saturation-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "lightness-modifier" })).toHaveLength(1);

        // Displays correct hsl color code
        expect(swatchWrapper.find({ wrapperClass: "hue-modifier" }).prop("default")).toEqual(0);
        expect(swatchWrapper.find({ wrapperClass: "saturation-modifier" }).prop("default")).toEqual(33);
        expect(swatchWrapper.find({ wrapperClass: "lightness-modifier" }).prop("default")).toEqual(30);
    });

    it("Displays new sliders and converts correctly to cmyk", () => {
        // Color #663333
        // cmyk = 102, 51, 51

        // Displays correct color sliders
        swatchWrapper.setProps({ colorMode: "cmyk", color: "#663333" });

        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find("Slider")).toHaveLength(4);
        expect(swatchWrapper.find({ wrapperClass: "cyan-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "magenta-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "yellow-modifier" })).toHaveLength(1);
        expect(swatchWrapper.find({ wrapperClass: "black-modifier" })).toHaveLength(1);

        // Displays correct cmyk color code
        expect(swatchWrapper.find({ wrapperClass: "cyan-modifier" }).prop("default")).toEqual(0);
        expect(swatchWrapper.find({ wrapperClass: "magenta-modifier" }).prop("default")).toEqual(50);
        expect(swatchWrapper.find({ wrapperClass: "yellow-modifier" }).prop("default")).toEqual(50);
        expect(swatchWrapper.find({ wrapperClass: "black-modifier" }).prop("default")).toEqual(60);
    });
});

describe("Swatch changes color displayed and calls onColorChange callback when a slider is changed.", () => {
    // rgb = 102, 51, 51
    // hsb = 0, 50, 40
    let color = "#663333";
    const setColor = jest.fn(newColor => {
        color = newColor;
    });
    const swatchWrapper = mount(<Swatch selected={true} color={color} onColorChange={setColor} colorMode={"hsb"} />);

    it("Properly recalculates hex color code based on hue slider change", () => {
        swatchWrapper
            .find(".hue-modifier .modifier-thumb")
            .getDOMNode()
            .focus();

        // increases hue by 10
        simulateKeyDown(swatchWrapper, ".hue-modifier .modifier-thumb", "page_up");

        swatchWrapper.update();

        expect(setColor).toHaveBeenCalled();
        expect(color).toEqual("#663B33");

        swatchWrapper.setProps({ colorMode: "hsb", color });

        expect(swatchWrapper.find("h6").text()).toEqual("#663B33");
        // Would normally be 10, but there is no hex color to properly represent hsb(9, 0.5, 0.4)
        expect(
            swatchWrapper
                .find("span")
                .first()
                .text()
        ).toEqual("9");

        expect(swatchWrapper.find(".swatch").prop("style")).toHaveProperty("backgroundColor");
        expect(swatchWrapper.find(".swatch").prop("style").backgroundColor).toEqual("#663B33");
    });
});

describe("Swatch properly handles optional delete swatch functionality", () => {
    const swatchWrapper = mount(<Swatch selected={true} color={"#663333"} onColorChange={() => {}} colorMode={"hsb"} />);

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
        swatchWrapper.find("button").simulate("click");

        expect(callback).toHaveBeenCalled();
    });
});
