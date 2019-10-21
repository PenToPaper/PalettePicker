import React from "react";
import SwatchSection from "../src/SwatchSection";
import { shallow, mount } from "enzyme";

describe("Swatch Section properly renders elements based on props", () => {
    const callback = jest.fn();
    // Key in production should probably be a timestamp and a random number, so as to minimize risk of duplicate keys
    const swatchData = {
        10: "#aaaaaa",
        2: "#aaabbb",
        13: "#aaaccc"
    };
    const selection = 2;
    const swatchSectionWrapper = shallow(<SwatchSection sectionName="Section Title" swatches={swatchData} selection={selection} onAddSwatch={callback} />);

    it("Renders a header", () => {
        expect(
            swatchSectionWrapper
                .find("section")
                .find("h1")
                .text()
        ).toEqual("Section Title");
    });

    it("Renders an add swatch button", () => {
        expect(swatchSectionWrapper.find("AddSwatch")).toHaveLength(1);
    });

    it("Renders all swatches in argument list", () => {
        expect(swatchSectionWrapper.find("Swatch")).toHaveLength(3);
        expect(swatchSectionWrapper.find({ color: "#aaaaaa", selected: false })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaabbb", selected: true })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaaccc", selected: false })).toHaveLength(1);
        expect(swatchSectionWrapper.find({ color: "#aaaddd" })).toHaveLength(0);
    });
});

describe("Swatch Section calls onAddSwatch callback, and renders more swatches after initial load if added to props", () => {
    let swatchData = {
        10: "#aaaaaa",
        2: "#aaabbb",
        13: "#aaaccc"
    };
    const callback = jest.fn(() => {
        const newSwatchData = Object.assign({}, swatchData);
        newSwatchData[4] = "#aaaddd";
        swatchData = newSwatchData;
    });

    const swatchSectionWrapper = mount(<SwatchSection sectionName="Section Title" swatches={swatchData} onAddSwatch={callback} />);

    it("Calls onAddSwatch on add swatch click, and refreshes swatch list", () => {
        swatchSectionWrapper.find("AddSwatch").simulate("click");

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
});
