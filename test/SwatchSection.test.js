import React from "react";
import SwatchSection from "../src/SwatchSection";
import { shallow, mount } from "enzyme";

describe("Swatch Section properly renders elements based on props", () => {
    const callback = jest.fn();
    // Key in production should probably be a timestamp and a random number, so as to minimize risk of duplicate keys
    const swatchData = {
        10: "#aaaaaa",
        2: "#aaabbb",
        13: "#aaaccc",
    };
    const selection = 2;
    const onChangeCallback = jest.fn();
    const swatchSectionWrapper = shallow(<SwatchSection sectionName="Section Title" swatches={swatchData} selection={selection} onAddSwatch={callback} onChange={onChangeCallback} onSelectSwatch={() => {}} />);

    it("Renders a header", () => {
        expect(swatchSectionWrapper.find("section").find("input").prop("value")).toEqual("Section Title");
    });

    it("Renders an add swatch button", () => {
        expect(swatchSectionWrapper.find("button").at(0)).toHaveLength(1);
        expect(swatchSectionWrapper.find("button").at(0).prop("aria-label")).toEqual("Add Swatch to Section");
        expect(swatchSectionWrapper.find("button").at(0).prop("className")).toEqual("add-swatch");
    });

    it("Renders all swatches in argument list", () => {
        expect(swatchSectionWrapper.find("Swatch")).toHaveLength(3);
        expect(swatchSectionWrapper.find({ color: "#aaaaaa", selected: false })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaabbb", selected: true })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaaccc", selected: false })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaaddd" })).toHaveLength(0);
    });

    it("Passes onChange method to swatches", () => {
        expect(swatchSectionWrapper.find("Swatch").map((swatch) => typeof swatch.prop("onChange") === "function")).toEqual([true, true, true]);
        swatchSectionWrapper.find({ color: "#aaaaaa", selected: false }).prop("onChange")("#fffccc");
        expect(onChangeCallback).toHaveBeenLastCalledWith("10", "#fffccc");
    });
});

describe("Swatch Section calls onAddSwatch callback, and renders more swatches after initial load if added to props", () => {
    let swatchData = {
        10: "#aaaaaa",
        2: "#aaabbb",
        13: "#aaaccc",
    };
    const callback = jest.fn(() => {
        const newSwatchData = Object.assign({}, swatchData);
        newSwatchData[4] = "#aaaddd";
        swatchData = newSwatchData;
    });

    const onSelect = jest.fn();
    const swatchSectionWrapper = mount(<SwatchSection sectionName="Section Title" swatches={swatchData} onAddSwatch={callback} onSelectSwatch={onSelect} />);

    it("Calls onAddSwatch on add swatch click, and refreshes swatch list", () => {
        swatchSectionWrapper.find("button").at(0).prop("onClick")();

        expect(callback).toHaveBeenCalled();
        expect(Object.keys(swatchData).length).toEqual(4);
        expect(swatchData["4"]).toEqual("#aaaddd");

        swatchSectionWrapper.setProps({ swatches: swatchData });

        expect(swatchSectionWrapper.find("Swatch")).toHaveLength(4);
        expect(swatchSectionWrapper.find({ color: "#aaaaaa" })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaabbb" })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaaccc" })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaaddd" })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaaeee" })).toHaveLength(0);
    });

    it("Calls onSelect with correct arguments from Swatch", () => {
        swatchSectionWrapper.find({ color: "#aaaaaa" }).prop("onSelect")();
        expect(onSelect).toHaveBeenLastCalledWith("10");
    });
});
