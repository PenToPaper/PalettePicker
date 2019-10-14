import React from "react";
import Nav from "../src/Nav";
import { shallow, mount } from "enzyme";

describe("Nav renders default state correctly based on props", () => {
    const navWrapper = shallow(<Nav />);

    it("Renders correct number of children", () => {
        // Expects children img, button, div#hamburger-menu-body
        expect(navWrapper.children("img")).toHaveLength(1);
        expect(navWrapper.children("button")).toHaveLength(1);
        expect(navWrapper.children("div#hamburger-menu-body")).toHaveLength(1);
    });

    it("Renders a button with the correct aria attributes", () => {
        // Expects aria attributes per https://www.w3.org/WAI/tutorials/menus/flyout/
        // aria-label, aria-expanded, aria-controls
        expect(
            navWrapper
                .children("button")
                .first()
                .prop("aria-label")
        ).toBeTruthy();
        expect(
            navWrapper
                .children("button")
                .first()
                .prop("aria-expanded")
        ).toEqual("false");
        expect(
            navWrapper
                .children("button")
                .first()
                .prop("aria-controls")
        ).toEqual("hamburger-menu-body");
    });

    it("Renders a #hamburger-menu-body with the correct attributes", () => {
        // Expects aria attributes per https://www.w3.org/WAI/tutorials/menus/flyout/
        // aria-label
        expect(
            navWrapper
                .children("#hamburger-menu-body")
                .first()
                .prop("aria-label")
        ).toBeTruthy();

        // Expects hamburger-menu-body to be hidden at first
        expect(
            navWrapper
                .children("#hamburger-menu-body")
                .first()
                .prop("hidden")
        ).toBeTruthy();
    });

    it("Expects the first project in the nav list to be selected", () => {
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
                .prop("aria-selected")
        ).toEqual("true");
    });

    it("Expects the 2nd project in the nav list not to be selected", () => {
        // Expects 2nd item in hamburger-menu-body to not be selected with aria and class
        expect(
            navWrapper
                .find("li")
                .last()
                .hasClass("project-selected")
        ).toEqual(false);
        expect(
            navWrapper
                .find("li")
                .last()
                .prop("aria-selected")
        ).toEqual("false");
    });

    it("Expects the root nav not to be expanded", () => {
        // Expects root nav not to have hamburger-menu-expanded class
        expect(navWrapper.find("nav").hasClass("hamburger-menu-expanded")).toEqual(false);
    });
});

describe("Nav changes render based on toggle button press", () => {
    const navWrapper = mount(<Nav />);
    // Simulate button press
    navWrapper
        .find("button")
        .first()
        .simulate("click");

    it("Changes the button aria attribute", () => {
        // Checks that button aria attribute updates
        expect(
            navWrapper
                .find("button")
                .first()
                .prop("aria-expanded")
        ).toEqual("true");
    });

    it("Changes to make the hamburger menu pullout visible", () => {
        // Checks that hamburger menu is visible
        expect(
            navWrapper
                .find("#hamburger-menu-body")
                .first()
                .prop("hidden")
        ).toEqual(false);

        // Checks that nav has correct class
        expect(navWrapper.find("nav").hasClass("hamburger-menu-expanded")).toEqual(true);
    });
});
