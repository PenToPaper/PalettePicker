import React from "react";
import Swatch from "../src/Swatch";
import { shallow, mount } from "enzyme";
import simulateKeyDown from "./SimulateKeyDown";

describe("Swatch renders default state correctly based on props", () => {
    const swatchWrapper = shallow(<Swatch selected={false} color="#ffffff" onColorChange={() => {}} handleDelete={() => {}} colorMode={"hsb"} />);

    it("Renders proper child elements", () => {
        // Swatch itself has aria-compatible attributes
        expect(swatchWrapper.find(".swatch").prop("tabIndex")).toEqual("0");
        expect(swatchWrapper.find(".swatch").props()).not.toHaveProperty("aria-selected");

        // h6
        expect(swatchWrapper.find("h6")).toHaveLength(1);
        expect(swatchWrapper.find("h6").html()).toEqual("#FFFFFF");

        // Delete swatch button
        expect(swatchWrapper.find("button")).toHaveLength(1);
        expect(swatchWrapper.find("button").prop("aria-label")).toEqual("Delete Swatch");
    });

    it("Renders proper color values for hsb on load", () => {
        // Swatch modifier
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".hue-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".saturation-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".brightness-modifier")).toHaveLength(1);

        // Displays correct hsb color code
        expect(swatchWrapper.find(".hue-modifier modifier-thumb").prop("aria-valuenow")).toEqual("0");
        expect(swatchWrapper.find(".saturation-modifier modifier-thumb").prop("aria-valuenow")).toEqual("50");
        expect(swatchWrapper.find(".brightness-modifier modifier-thumb").prop("aria-valuenow")).toEqual("40");
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
        expect(swatchWrapper.find(".red-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".green-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".blue-modifier")).toHaveLength(1);

        // Displays correct rgb color code
        expect(swatchWrapper.find(".red-modifier modifier-thumb").prop("aria-valuenow")).toEqual("102");
        expect(swatchWrapper.find(".green-modifier modifier-thumb").prop("aria-valuenow")).toEqual("51");
        expect(swatchWrapper.find(".blue-modifier modifier-thumb").prop("aria-valuenow")).toEqual("51");
    });

    it("Displays new sliders and converts correctly to hsl", () => {
        // Color #663333
        // hsl = 0, 33, 30

        // Displays correct color sliders
        swatchWrapper.setProps({ colorMode: "rgb", color: "#663333" });
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".hue-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".saturation-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".lightness-modifier")).toHaveLength(1);

        // Displays correct rgb color code
        expect(swatchWrapper.find(".hue-modifier modifier-thumb").prop("aria-valuenow")).toEqual("0");
        expect(swatchWrapper.find(".saturation-modifier modifier-thumb").prop("aria-valuenow")).toEqual("33");
        expect(swatchWrapper.find(".lightness-modifier modifier-thumb").prop("aria-valuenow")).toEqual("30");
    });

    it("Displays new sliders and converts correctly to cmyk", () => {
        // Color #663333
        // cmyk = 102, 51, 51

        // Displays correct color sliders
        swatchWrapper.setProps({ colorMode: "rgb", color: "#663333" });
        expect(swatchWrapper.find(".swatch-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".cyan-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".magenta-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".yellow-modifier")).toHaveLength(1);
        expect(swatchWrapper.find(".black-modifier")).toHaveLength(1);

        // Displays correct rgb color code
        expect(swatchWrapper.find(".cyan-modifier modifier-thumb").prop("aria-valuenow")).toEqual("0");
        expect(swatchWrapper.find(".magenta-modifier modifier-thumb").prop("aria-valuenow")).toEqual("20");
        expect(swatchWrapper.find(".yellow-modifier modifier-thumb").prop("aria-valuenow")).toEqual("20");
        expect(swatchWrapper.find(".black-modifier modifier-thumb").prop("aria-valuenow")).toEqual("60");
    });
});

describe("Swatch changes color displayed and calls onColorChange callback when a slider is changed.", () => {
    // rgb = 102, 51, 51
    // hsb = 0, 50, 40
    let color = "#663333";
    const setColor = jest.fn(newColor => {
        color = newColor;
    });
    const swatchWrapper = mount(<Swatch selected={true} color={color} onColorChange={setColor} handleDelete={() => {}} colorMode={"hsb"} />);

    it("Properly recalculates hex color code based on hue slider change", () => {
        swatchWrapper
            .find(".hue-modifier .modifier-thumb")
            .getDOMNode()
            .focus();

        // increases hue by 10
        simulateKeyDown(swatchWrapper, ".hue-modifier .modifier-thumb", "page_up");

        swatchWrapper.update();

        expect(setColor).toHaveBeenCalled();
        expect(color).toEqual("#663C33");

        expect(swatchWrapper.find("h6").html()).toEqual("#663C33");
        expect(
            swatchWrapper
                .find("span")
                .first()
                .html()
        ).toEqual("10");

        expect(swatchWrapper.find(".swatch").prop("style")).toHaveProperty("backgroundColor");
        expect(swatchWrapper.find(".swatch").prop("style").backgroundColor).toEqual("#663C33");
    });
});
