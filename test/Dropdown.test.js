import React from "react";
import Dropdown from "../src/Dropdown";
import { shallow, mount } from "enzyme";

it("Renders dropdown menu correctly based on props", () => {
    const dropdownWrapper = shallow(<Dropdown lablelId="dropdown-color-harmony" options={["None", "Complementary", "Analogous", "Triad", "Split-Complementary", "Rectangle"]} selectedOptionIndex={0} />);

    // Validates html structure, default aria attributes
    expect(dropdownWrapper.children("button#dropdown-color-harmony-selected")).toHaveLength(1);
    expect(dropdownWrapper.children("ul")).toHaveLength(1);
    expect(dropdownWrapper.find("li")).toHaveLength(6);

    expect(dropdownWrapper.find("button").prop("aria-haspopup")).toEqual("listbox");
    expect(dropdownWrapper.find("button").prop("aria-expanded")).toEqual(undefined);
    expect(dropdownWrapper.find("button").prop("aria-labeledby")).toEqual("dropdown-color-harmony dropdown-color-harmony-selected");

    expect(dropdownWrapper.find("ul").prop("role")).toEqual("listbox");
    expect(dropdownWrapper.find("ul").prop("aria-labeledby")).toEqual("dropdown-color-harmony");
    expect(dropdownWrapper.find("ul").prop("tabindex")).toEqual("-1");
    expect(dropdownWrapper.find("ul").prop("aria-activedescendant")).toEqual("dropdown-color-harmony-0");

    // Expects all li elements in dropdown to have role="option", id and key = "${labelId}-${index}"
    expect(dropdownWrapper.find("li").map(li => li.prop("role"))).toEqual(["option", "option", "option", "option", "option", "option"]);
    expect(dropdownWrapper.find("li").map(li => li.prop("id"))).toEqual(["dropdown-color-harmony-0", "dropdown-color-harmony-1", "dropdown-color-harmony-2", "dropdown-color-harmony-3", "dropdown-color-harmony-4", "dropdown-color-harmony-5"]);
    expect(dropdownWrapper.find("li").map(li => li.key())).toEqual(["dropdown-color-harmony-0", "dropdown-color-harmony-1", "dropdown-color-harmony-2", "dropdown-color-harmony-3", "dropdown-color-harmony-4", "dropdown-color-harmony-5"]);

    // Expects selected li element to have aria-selected="true"
    expect(dropdownWrapper.find("li").map(li => li.prop("aria-selected"))).toEqual(["true", undefined, undefined, undefined, undefined, undefined]);
    expect(dropdownWrapper.find("li").map(li => li.hasClass("dropdown-selected"))).toEqual([true, false, false, false, false, false]);
});

it("Controls dropdown with w3 accessible keyboard interaction", () => {
    const dropdownWrapper = mount(<Dropdown lablelId="dropdown-color-harmony" options={["None", "Complementary", "Analogous", "Triad", "Split-Complementary", "Rectangle"]} selectedOptionIndex={0} />);

    const simulateKeyDown = (elementName, key) => {
        let keyCode = 0;
        switch (key) {
            case "enter":
                keyCode = 13;
            case "end":
                keyCode = 35;
            case "home":
                keyCode = 36;
            case "arrow_down":
                keyCode = 40;
            case "arrow_up":
                keyCode = 38;
            case "escape":
                keyCode = 27;
            case "t":
                keyCode = 84;
        }
        dropdownWrapper.find(elementName).prop("onKeyDown")({ keyCode });
    };

    const expectMenuOpen = menuOpen => {
        expect(dropdownWrapper.find("button").prop("aria-expanded")).toEqual(menuOpen ? "true" : undefined);
        expect(dropdownWrapper.find(".dropdown").hasClass("dropdown-expanded")).toEqual(menuOpen);
    };

    const expectLiSelected = index => {
        let expectedAriaSelected = [].fill(undefined, 0, 6);
        expectedAriaSelected[index] = "true";

        let expectedDropdownSelected = [].fill(false, 0, 6);
        expectedDropdownSelected[index] = true;

        expect(dropdownWrapper.find("li").map(li => li.prop("aria-selected"))).toEqual(expectedAriaSelected);
        expect(
            dropdownWrapper
                .find("li")
                .get(index)
                .hasClass("dropdown-selected")
        ).toEqual(expectedDropdownSelected);
    };

    // Focus button
    dropdownWrapper
        .find("button")
        .getDOMNode()
        .focus();

    simulateKeyDown("button", "enter");

    // Menu is visible and aria expanded
    expectMenuOpen(true);

    // Focus is moved to ul
    expect(dropdownWrapper.find("ul:focus")).toHaveLength(1);

    simulateKeyDown("ul", "end");

    // Bottom li is selected
    expectLiSelected(5);

    simulateKeyDown("ul", "home");

    // Top li is selected
    expectLiSelected(0);

    simulateKeyDown("ul", "arrow_down");
    simulateKeyDown("ul", "arrow_down");
    simulateKeyDown("ul", "arrow_up");

    // 2nd li is selected
    expectLiSelected(1);

    simulateKeyDown("ul", "enter");

    // Menu is NOT visible and aria NOT expanded
    expectMenuOpen(false);

    // Button text is replaced by the 2nd li option
    expect(dropdownWrapper.find("button").text()).toEqual("Complementary");

    // Focus is returned to the button
    expect(dropdownWrapper.find("button:focus")).toHaveLength(1);

    simulateKeyDown("button", "arrow_down");

    // Menu is visible and aria expanded
    expectMenuOpen(true);

    // 3rd li is selected
    expectLiSelected(2);

    simulateKeyDown("ul", "escape");

    // Menu is NOT visible and aria NOT expanded
    expectMenuOpen(false);

    // Button text is replaced by the 2nd li option
    expect(dropdownWrapper.find("button").text()).toEqual("Complementary");

    simulateKeyDown("button", "arrow_down");
    simulateKeyDown("ul", "t");

    // 4th li is selected
    expectLiSelected(4);
});
