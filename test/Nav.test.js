import React from "react";
import Nav from "../src/Nav";
import { shallow } from "enzyme";

it("Renders navigation menu default properly.", () => {
    const navWrapper = shallow(<Nav />);

    // Expects children img, button, div#hamburger-menu-body
    expect(navWrapper.children("img")).toHaveLength(1);
    expect(navWrapper.children("button")).toHaveLength(1);
    expect(navWrapper.children("div#hamburger-menu-body")).toHaveLength(1);

    // Expects aria attributes per https://www.w3.org/WAI/tutorials/menus/flyout/
    // aria-label, aria-expanded, aria-controls
    expect(
        navWrapper
            .children("button")
            .first()
            .getDOMNode()
            .hasAttribute("aria-label")
    ).toEqual(true);
    expect(
        navWrapper
            .children("button")
            .first()
            .getDOMNode()
            .getAttribute("aria-expanded")
    ).toEqual("false");
    expect(
        navWrapper
            .children("button")
            .first()
            .getDOMNode()
            .getAttribute("aria-controls")
    ).toEqual("hamburger-menu-body");

    // Expects aria attributes per https://www.w3.org/WAI/tutorials/menus/flyout/
    // aria-label
    expect(
        navWrapper
            .children("#hamburger-menu-body")
            .first()
            .getDOMNode()
            .hasAttribute("aria-label")
    ).toEqual(true);

    // Expects hamburger-menu-body to be hidden at first
    expect(
        navWrapper
            .children("#hamburger-menu-body")
            .first()
            .getDOMNode()
            .getAttribute("hidden")
    ).toEqual("true");

    // Expects first item in hamburger-menu-body to be selected with aria and class
    expect(
        navWrapper
            .find("li")
            .first()
            .hasClass("project-selected")
    ).toEqual(true);
    expect(
        navWrapper
            .find("li")
            .first()
            .getAttribute("aria-selected")
    ).toEqual("true");

    // Expects 2nd item in hamburger-menu-body to not be selected with aria and class
    expect(
        navWrapper
            .find("li")
            .first()
            .hasClass("project-selected")
    ).toEqual(false);
    expect(
        navWrapper
            .find("li")
            .first()
            .getAttribute("aria-selected")
    ).toEqual("false");
});

it("Changes render after navigation toggle button pressed", () => {
    // Simulate button press
    const navWrapper = shallow(<Nav />);
    navWrapper
        .children("button")
        .first()
        .simulate("click");

    // Checks that button aria attribute updates
    expect(
        navWrapper
            .children("button")
            .first()
            .getDOMNode()
            .getAttribute("aria-expanded")
    ).toEqual("true");

    // Checks that hamburger menu is visible
    expect(
        navWrapper
            .children("#hamburger-menu-body")
            .first()
            .getDOMNode()
            .getAttribute("hidden")
    ).toEqual("false");

    // Checks that nav has correct class
    expect(navWrapper.hasClass("hamburger-menu-expanded")).toEqual(true);
});
