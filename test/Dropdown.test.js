import React from "react";
import Dropdown from "../src/Dropdown";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";

describe("Dropdown renders default state correctly based on props", () => {
    const dropdownWrapper = shallow(<Dropdown labelId="dropdown-color-harmony" options={["None", "Complementary", "Analogous", "Triad", "Split-Complementary", "Rectangle"]} selectedOptionIndex={0} />);

    it("Renders correct number of children", () => {
        expect(dropdownWrapper.children("button#dropdown-color-harmony-selected")).toHaveLength(1);
        expect(dropdownWrapper.children("ul")).toHaveLength(1);
        expect(dropdownWrapper.find("li")).toHaveLength(6);
    });

    it("Renders dropdown button with correct aria attributes", () => {
        expect(dropdownWrapper.find("button").prop("aria-haspopup")).toEqual("listbox");
        expect(dropdownWrapper.find("button").prop("aria-expanded")).toEqual(undefined);
        expect(dropdownWrapper.find("button").prop("aria-labelledby")).toEqual("dropdown-color-harmony dropdown-color-harmony-selected");
    });

    it("Renders dropdown ul with correct accessibility attributes", () => {
        expect(dropdownWrapper.find("ul").prop("role")).toEqual("listbox");
        expect(dropdownWrapper.find("ul").prop("aria-labelledby")).toEqual("dropdown-color-harmony");
        expect(dropdownWrapper.find("ul").prop("tabIndex")).toEqual("-1");
        expect(dropdownWrapper.find("ul").prop("aria-activedescendant")).toEqual("dropdown-color-harmony-0");
    });

    it("Renders all li elements with proper react and accessibility attributes", () => {
        expect(dropdownWrapper.find("li").map(li => li.prop("role"))).toEqual(["option", "option", "option", "option", "option", "option"]);
        expect(dropdownWrapper.find("li").map(li => li.prop("id"))).toEqual(["dropdown-color-harmony-0", "dropdown-color-harmony-1", "dropdown-color-harmony-2", "dropdown-color-harmony-3", "dropdown-color-harmony-4", "dropdown-color-harmony-5"]);
        expect(dropdownWrapper.find("li").map(li => li.key())).toEqual(["dropdown-color-harmony-0", "dropdown-color-harmony-1", "dropdown-color-harmony-2", "dropdown-color-harmony-3", "dropdown-color-harmony-4", "dropdown-color-harmony-5"]);
    });

    it("Properly selects the active li element", () => {
        expect(dropdownWrapper.find("li").map(li => li.prop("aria-selected"))).toEqual(["true", undefined, undefined, undefined, undefined, undefined]);
        expect(dropdownWrapper.find("li").map(li => li.hasClass("dropdown-selected"))).toEqual([true, false, false, false, false, false]);
    });
});

describe("Dropdown renders updated states properly based on keyboard input", () => {
    const dropdownWrapper = mount(<Dropdown labelId="dropdown-color-harmony" options={["None", "Complementary", "Analogous", "Triad", "Split-Complementary", "Rectangle"]} selectedOptionIndex={0} />);

    const simulateKeyDown = (elementName, key) => {
        let keyCode = 0;
        switch (key) {
            case "enter":
                keyCode = 13;
                break;
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
            case "escape":
                keyCode = 27;
                break;
            case "t":
                keyCode = 84;
                break;
        }
        act(() => {
            dropdownWrapper.find(elementName).simulate("keydown", { keyCode, key });
        });
    };

    const expectMenuOpen = menuOpen => {
        expect(dropdownWrapper.find("button").prop("aria-expanded")).toEqual(menuOpen ? "true" : undefined);
        expect(dropdownWrapper.find(".dropdown").hasClass("dropdown-expanded")).toEqual(menuOpen);
    };

    const expectLiSelected = index => {
        let expectedAriaSelected = new Array(6).fill(undefined);
        expectedAriaSelected[index] = "true";

        let expectedDropdownSelected = new Array(6).fill(false);
        expectedDropdownSelected[index] = true;

        expect(dropdownWrapper.find("li").map(li => li.prop("aria-selected"))).toEqual(expectedAriaSelected);
        expect(
            dropdownWrapper
                .find("li")
                .get(index)
                .props.className.includes("dropdown-selected")
        ).toEqual(true);
    };

    it("Opens the dropdown menu with button focused and enter keypress", () => {
        // Focus button
        dropdownWrapper
            .find("button")
            .getDOMNode()
            .focus();

        simulateKeyDown("button", "enter");

        dropdownWrapper.update();

        // Menu is visible and aria expanded
        expectMenuOpen(true);

        // Focus is moved to ul
        expect(dropdownWrapper.find("ul").is(":focus")).toEqual(true);
    });

    it("Changes active li element based on home and end keypress", () => {
        simulateKeyDown("ul", "end");

        // Bottom li is selected
        dropdownWrapper.update();
        expectLiSelected(5);

        simulateKeyDown("ul", "home");

        // Top li is selected
        dropdownWrapper.update();
        expectLiSelected(0);
    });

    it("Changes active li element based on arrow up and arrow down keypress", () => {
        simulateKeyDown("ul", "arrow_down");
        simulateKeyDown("ul", "arrow_down");
        simulateKeyDown("ul", "arrow_up");

        // 2nd li is selected
        dropdownWrapper.update();
        expectLiSelected(1);
    });

    it("Changes selected element and closes menu on enter keypress", () => {
        simulateKeyDown("ul", "enter");

        // Menu is NOT visible and aria NOT expanded
        dropdownWrapper.update();
        expectMenuOpen(false);

        // Button text is replaced by the 2nd li option
        expect(dropdownWrapper.find("button").text()).toEqual("Complementary");

        // Focus is returned to the button
        expect(dropdownWrapper.find("button").is(":focus")).toEqual(true);
    });

    it("Makes the menu visible on button focus arrow down keypress", () => {
        simulateKeyDown("button", "arrow_down");

        // Menu is visible and aria expanded
        dropdownWrapper.update();
        expectMenuOpen(true);

        // 3rd li is selected
        expectLiSelected(2);
    });

    it("Changes selected element and closes menu on escape keypress", () => {
        simulateKeyDown("ul", "escape");

        // Menu is NOT visible and aria NOT expanded
        dropdownWrapper.update();
        expectMenuOpen(false);

        // Button text is replaced by the 2nd li option
        expect(dropdownWrapper.find("button").text()).toEqual("Analogous");
    });

    it("Moves selected li element based on text typing", () => {
        simulateKeyDown("button", "arrow_up");
        simulateKeyDown("ul", "t");

        // 4th li is selected
        dropdownWrapper.update();
        expectLiSelected(3);
    });
});
