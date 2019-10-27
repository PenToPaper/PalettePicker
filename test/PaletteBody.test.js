import React from "react";
import PaletteBody from "../src/PaletteBody";
import { shallow } from "enzyme";

describe("Palette body translates props into swatch sections", () => {
    const swatchData = {
        Main: {
            10: "#aaaaaa",
            2: "#aaabbb",
            13: "#aaaccc"
        },
        Body: {
            3: "#aaaddd",
            4: "#aaaeee",
            5: "#aaafff"
        }
    };
    const selection = {
        sectionName: "Main",
        index: 2
    };

    const addSwatch = jest.fn(swatchSection => {
        swatchData[swatchSection][11] = "#bbbaaa";
    });

    const onChange = jest.fn();
    const bodyWrapper = shallow(<PaletteBody swatches={swatchData} selection={selection} onSelectSwatch={() => {}} onAddSwatch={addSwatch} onChange={onChange} />);

    it("Contains boilerplate structure", () => {
        expect(bodyWrapper.find("article")).toHaveLength(1);
    });

    it("Contains the proper SwatchSection components", () => {
        expect(bodyWrapper.find({ sectionName: "Main" })).toHaveLength(1);
        expect(bodyWrapper.find({ sectionName: "Main" }).prop("swatches")).toEqual(swatchData.Main);
        expect(bodyWrapper.find({ sectionName: "Main" }).prop("selection")).toEqual(selection.index);
        expect(bodyWrapper.find({ sectionName: "Main" }).key()).toEqual("Main");
        expect(bodyWrapper.find({ sectionName: "Body" })).toHaveLength(1);
        expect(bodyWrapper.find({ sectionName: "Body" }).prop("swatches")).toEqual(swatchData.Body);
        expect(bodyWrapper.find({ sectionName: "Body" }).prop("selection")).toEqual(undefined);
        expect(bodyWrapper.find({ sectionName: "Body" }).key()).toEqual("Body");
    });

    it("Calls the onAddSwatch callback with the sectionName as first argument", () => {
        bodyWrapper.find({ sectionName: "Main" }).prop("onAddSwatch")();
        expect(addSwatch).toHaveBeenCalledWith("Main");

        bodyWrapper.find({ sectionName: "Body" }).prop("onAddSwatch")();
        expect(addSwatch).toHaveBeenCalledWith("Body");
    });

    it("Supplies onChange method to SwatchSections", () => {
        bodyWrapper.find({ sectionName: "Main" }).prop("onChange")(1, "#fffaaa");
        expect(onChange).toHaveBeenLastCalledWith("Main", 1, "#fffaaa");
        bodyWrapper.find({ sectionName: "Body" }).prop("onChange")(2, "#fffbbb");
        expect(onChange).toHaveBeenLastCalledWith("Body", 2, "#fffbbb");
    });
});
