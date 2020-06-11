import React from "react";
import * as Nav from "../src/Nav";
import { shallow, mount } from "enzyme";
import FocusTrap from "focus-trap-react";
import { act } from "react-dom/test-utils";
import simulateKeyDown from "./SimulateKeyDown";

// Renders state properly based on props
// Renders proper elements, proper aria attributes on starter state

describe("Renders state properly based on props", () => {
    let projects = ["My Project 1", "My Project 2"];
    const activeProject = 0;
    const selectProject = jest.fn();
    const projectNameChange = jest.fn((index, newName) => {
        projects[index] = newName;
        navWrapper.setProps({ projects });
    });
    const projectDelete = jest.fn((index) => {
        projects = projects.filter((project, i) => i !== index);
        navWrapper.setProps({ projects });
    });
    const addProject = jest.fn(() => {
        projects = projects.concat();
        projects.push("My Project " + projects.length);
        navWrapper.setProps({ projects });
    });
    const navWrapper = shallow(<Nav.default projects={projects} activeProject={activeProject} onSelectProject={selectProject} onProjectNameChange={projectNameChange} onDeleteProject={projectDelete} onAddProject={addProject} />);

    it("Renders proper static elements", () => {
        // Top-level nav
        expect(navWrapper.find("nav")).toHaveLength(1);
        expect(navWrapper.find("nav").prop("className")).toEqual("");
        expect(navWrapper.find(FocusTrap)).toHaveLength(1);
        expect(navWrapper.find(FocusTrap).prop("active")).toEqual(false);

        // Images have alt props
        navWrapper.find("img").forEach((node) => {
            expect(node.prop("alt")).not.toEqual(undefined);
        });

        // Hamburger menu button
        expect(navWrapper.find(".hamburger-menu-container")).toHaveLength(1);
        expect(navWrapper.find(".hamburger-menu-container").prop("aria-label")).not.toEqual(undefined);
        expect(navWrapper.find(".hamburger-menu-container").prop("aria-expanded")).toEqual("false");
        expect(navWrapper.find(".hamburger-menu-container").prop("aria-controls")).toEqual("hamburger-menu-body");

        // Hamburger menu body
        expect(navWrapper.find("#hamburger-menu-body")).toHaveLength(1);
        expect(navWrapper.find("#hamburger-menu-body").prop("aria-label")).not.toEqual(undefined);
        expect(navWrapper.find("#hamburger-menu-body").prop("hidden")).toEqual(true);

        // UL
        expect(navWrapper.find("ul")).toHaveLength(1);
        expect(navWrapper.find("ul").prop("role")).toEqual("menubar");
        expect(navWrapper.find("ul").prop("aria-label")).not.toEqual(undefined);

        // Add Project button
        expect(navWrapper.find(".add-project")).toHaveLength(1);
        expect(navWrapper.find(".add-project").text()).not.toEqual("");

        // Add Project button callback
        navWrapper.find(".add-project").prop("onClick")();
        expect(addProject).toHaveBeenCalled();

        let projectsList = navWrapper.find("ul").children();
        expect(projectsList).toHaveLength(3);
        projectDelete(2);
        projectsList = navWrapper.find("ul").children();
        expect(projectsList).toHaveLength(2);
    });

    it("Passes correct props to project elements based on starter state", () => {
        const projectsList = navWrapper.find("ul").children();

        expect(projectsList).toHaveLength(2);

        // First project
        expect(projectsList.get(0).props.selected).toEqual(true);
        expect(projectsList.get(0).props.index).toEqual(0);
        expect(projectsList.get(0).props.editing).toEqual(false);
        expect(projectsList.get(0).props.projectName).toEqual("My Project 1");
        expect(projectsList.get(0).props.confirmingDelete).toEqual(false);
        expect(typeof projectsList.get(0).props.onConfirmingDelete).toEqual("function");
        expect(typeof projectsList.get(0).props.onEditingClick).toEqual("function");

        // Second project
        expect(projectsList.get(1).props.selected).toEqual(false);
        expect(projectsList.get(1).props.index).toEqual(1);
        expect(projectsList.get(1).props.editing).toEqual(false);
        expect(projectsList.get(1).props.projectName).toEqual("My Project 2");
        expect(projectsList.get(1).props.confirmingDelete).toEqual(false);
        expect(typeof projectsList.get(1).props.onConfirmingDelete).toEqual("function");
        expect(typeof projectsList.get(1).props.onEditingClick).toEqual("function");
    });

    it("Project elements are constructed properly", () => {
        const projectNameChange = jest.fn();
        const selectProject = jest.fn();
        const deleteProject = jest.fn();
        const confirmingDelete = jest.fn();
        const editingClick = jest.fn();
        const projectWrapper = shallow(
            <Nav.Project
                selected={true}
                index={0}
                editing={false}
                projectName={"My Project 3"}
                confirmingDelete={false}
                onProjectNameChange={projectNameChange}
                onSelectProject={selectProject}
                onDeleteProject={deleteProject}
                onConfirmingDelete={confirmingDelete}
                onEditingClick={editingClick}
            />
        );

        const li = projectWrapper.find("li");
        const buttonList = projectWrapper.find("button");
        const imgList = projectWrapper.find("img");

        // Selected, default
        expect(li.hasClass("project-selected")).toEqual(true);
        expect(li.prop("id")).toEqual("project-0");
        expect(li.prop("aria-selected")).toEqual("true");
        expect(li.prop("role")).toEqual("menuitem");

        expect(buttonList.get(0).props.className).toEqual("nav-modifier");
        buttonList.get(0).props.onClick();
        expect(editingClick).toHaveBeenCalled();
        expect(imgList.get(0).props.alt).toEqual("Edit Project Label");

        expect(projectWrapper.find(Nav.ProjectSelectButton)).toHaveLength(1);
        expect(projectWrapper.find(Nav.ProjectSelectButton).prop("value")).toEqual("My Project 3");
        projectWrapper.find(Nav.ProjectSelectButton).prop("onClick")();
        expect(selectProject).toHaveBeenCalled();

        expect(buttonList.get(1).props.className).toEqual("nav-modifier");
        buttonList.get(1).props.onClick();
        expect(confirmingDelete).toHaveBeenCalled();

        // Unselected, default
        projectWrapper.setProps({ selected: false });
        expect(projectWrapper.find("li").hasClass("project-selected")).toEqual(false);
        expect(projectWrapper.find("li").prop("aria-selected")).toEqual("false");

        // Unselected, editing
        projectWrapper.setProps({ editing: true });
        expect(projectWrapper.find("img").get(0).props.alt).toEqual("Save Project Label");
        expect(projectWrapper.find(Nav.ProjectManagedInput)).toHaveLength(1);
        expect(projectWrapper.find(Nav.ProjectManagedInput).prop("value")).toEqual("My Project 3");
        projectWrapper.find(Nav.ProjectManagedInput).prop("onChange")();
        expect(projectNameChange).toHaveBeenCalled();

        // Confirming delete
        projectWrapper.setProps({ editing: true, confirmingDelete: true });
        expect(projectWrapper.find(Nav.ProjectConfirmDelete).prop("index")).toEqual(0);
        projectWrapper.find(Nav.ProjectConfirmDelete).prop("onDeleteProject")();
        projectWrapper.find(Nav.ProjectConfirmDelete).prop("onConfirmingDelete")();
        expect(confirmingDelete).toHaveBeenCalled();
        expect(deleteProject).toHaveBeenCalled();
    });

    it("ConfirmDelete elements are constructed properly", () => {
        const deleteProject = jest.fn();
        const confirmingDelete = jest.fn();
        const confirmDeleteWrapper = mount(<Nav.ProjectConfirmDelete index={0} onDeleteProject={deleteProject} onConfirmingDelete={confirmingDelete} />);

        // Top-level elements
        expect(confirmDeleteWrapper.find(FocusTrap)).toHaveLength(1);
        expect(confirmDeleteWrapper.find("div")).toHaveLength(1);
        expect(confirmDeleteWrapper.find("div").hasClass("project-delete")).toEqual(true);
        expect(confirmDeleteWrapper.find("div").prop("role")).toEqual("alertdialog");
        expect(confirmDeleteWrapper.find("div").prop("aria-modal")).toEqual("true");

        // Span
        expect(confirmDeleteWrapper.find("span").prop("id")).toEqual("0-proj-delete-desc");
        expect(confirmDeleteWrapper.find("span").text()).toEqual("Confirm delete project?");

        // Deny button
        expect(confirmDeleteWrapper.find(".deny-delete-project")).toHaveLength(1);
        confirmDeleteWrapper.find(".deny-delete-project").prop("onClick")();
        expect(confirmingDelete).toHaveBeenLastCalledWith(-1);

        // Deny button is focused
        expect(confirmDeleteWrapper.find(".deny-delete-project").is(":focus")).toEqual(true);

        // Confirm button
        confirmDeleteWrapper.find(".confirm-delete-project").prop("onClick")();
        expect(confirmingDelete).toHaveBeenLastCalledWith(-1);
        expect(confirmingDelete).toHaveBeenCalledTimes(2);
        expect(deleteProject).toHaveBeenCalled();
    });

    it("ProjectButton is constructed properly", () => {
        // ProjectButton
        const buttonProjectName = "My Project 1";
        const buttonClick = jest.fn();
        const projectButtonWrapper = mount(<Nav.ProjectSelectButton value={buttonProjectName} onClick={buttonClick} />);

        expect(projectButtonWrapper.find("button").hasClass("project")).toEqual(true);
        expect(projectButtonWrapper.find("button").text()).toEqual(buttonProjectName);
        projectButtonWrapper.find("button").prop("onClick")();
        expect(buttonClick).toHaveBeenCalled();
    });

    it("ProjectInput is constructed properly", () => {
        // ProjectButton
        let inputProjectName = "My Project 1";
        const inputChange = jest.fn((newName) => {
            inputProjectName = newName;
            projectInputWrapper.setProps({ value: inputProjectName });
        });
        const projectInputWrapper = mount(<Nav.ProjectManagedInput value={inputProjectName} onChange={inputChange} />);
        const mockEvent = { target: { value: "ABC" } };

        // Input is immediately focused
        expect(projectInputWrapper.find("input").is(":focus")).toEqual(true);

        expect(projectInputWrapper.find("input").prop("aria-label")).not.toEqual("");
        expect(projectInputWrapper.find("input").prop("aria-label")).not.toEqual(undefined);
        expect(projectInputWrapper.find("input").prop("value")).toEqual(inputProjectName);
        projectInputWrapper.find("input").prop("onChange")(mockEvent);
        expect(inputChange).toHaveBeenLastCalledWith("ABC");
        expect(projectInputWrapper.find("input").prop("value")).toEqual(inputProjectName);
    });
});

// Core functions of nav work properly

describe("Core functions of Nav work properly", () => {
    let projects = ["My Project 1", "My Project 2", "My Project 3", "My Project 4", "My Project 5"];
    const activeProject = 0;
    const selectProject = jest.fn();
    const projectNameChange = jest.fn((index, newName) => {
        projects[index] = newName;
        dropdownWrapper.setProps({ projects });
    });
    const projectDelete = jest.fn((index) => {
        projects = projects.filter((project, i) => i !== index);
        dropdownWrapper.setProps({ projects });
    });
    const addProject = jest.fn(() => {
        projects = projects.concat();
        projects.push("My Project " + projects.length);
        dropdownWrapper.setProps({ projects });
    });
    const navWrapper = mount(<Nav.default projects={projects} activeProject={activeProject} onSelectProject={selectProject} onProjectNameChange={projectNameChange} onDeleteProject={projectDelete} onAddProject={addProject} />);

    // Open button on click and enter toggle isOpen state, aria attributes update confirming that nav is open and nav's class is updated
    it("Toggles isOpen state and appearance", () => {
        // Before toggle, checks all isOpen dependent props
        expect(navWrapper.find(FocusTrap).prop("active")).toEqual(false);
        expect(navWrapper.find("nav").hasClass("hamburger-menu-expanded")).toEqual(false);
        expect(navWrapper.find(".hamburger-menu-container").prop("aria-expanded")).toEqual("false");
        expect(navWrapper.find("#hamburger-menu-body").prop("hidden")).toEqual(true);

        // Simulate click
        act(() => {
            navWrapper.find(".hamburger-menu-container").prop("onClick")();
        });
        navWrapper.update();

        // After toggle, checks all isOpen dependent props
        expect(navWrapper.find(FocusTrap).prop("active")).toEqual(true);
        expect(navWrapper.find("nav").hasClass("hamburger-menu-expanded")).toEqual(true);
        expect(navWrapper.find(".hamburger-menu-container").prop("aria-expanded")).toEqual("true");
        expect(navWrapper.find("#hamburger-menu-body").prop("hidden")).toEqual(false);
    });

    const preventDefault = jest.fn();
    const getMockEvent = (index, keyCode) => {
        return {
            keyCode,
            preventDefault: preventDefault,
            target: {
                closest: () => {
                    return {
                        id: {
                            substring: () => {
                                return index;
                            },
                        },
                    };
                },
            },
        };
    };

    it("Uses proper accessibility keyboard shortcuts to cycle through Projects when nav is open", () => {
        let focusedIndex;

        // 39 = arrow right
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(0, 39));
        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(focusedIndex).toEqual(1);

        // Wrap around
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(4, 39));
        expect(preventDefault).toHaveBeenCalledTimes(2);
        expect(focusedIndex).toEqual(0);

        // 40 = arrow down
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(0, 40));
        expect(preventDefault).toHaveBeenCalledTimes(3);
        expect(focusedIndex).toEqual(1);

        // Wrap around
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(4, 40));
        expect(preventDefault).toHaveBeenCalledTimes(4);
        expect(focusedIndex).toEqual(0);

        // 37 = arrow down
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(4, 37));
        expect(preventDefault).toHaveBeenCalledTimes(5);
        expect(focusedIndex).toEqual(3);

        // Wrap around
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(0, 37));
        expect(preventDefault).toHaveBeenCalledTimes(6);
        expect(focusedIndex).toEqual(4);

        // 38 = arrow up
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(4, 38));
        expect(preventDefault).toHaveBeenCalledTimes(7);
        expect(focusedIndex).toEqual(3);

        // Wrap around
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(0, 38));
        expect(preventDefault).toHaveBeenCalledTimes(8);
        expect(focusedIndex).toEqual(4);

        // 36 = Home
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(4, 36));
        expect(preventDefault).toHaveBeenCalledTimes(9);
        expect(focusedIndex).toEqual(0);

        // 35 = End
        focusedIndex = navWrapper.find("nav").prop("onKeyDown")(getMockEvent(4, 35));
        expect(preventDefault).toHaveBeenCalledTimes(10);
        expect(focusedIndex).toEqual(4);

        // 32 = Space
        navWrapper.find("nav").prop("onKeyDown")(getMockEvent(4, 32));
        expect(preventDefault).toHaveBeenCalledTimes(11);
    });

    it("Properly allows for editing of name of projects", () => {
        const projectNameChange = jest.fn();
        const selectProject = jest.fn();
        const deleteProject = jest.fn();
        const confirmingDelete = jest.fn();
        const editingClick = jest.fn(() => {
            editing = !editing;
            projectWrapper.setProps({ editing });
        });
        let editing = false;
        const projectWrapper = shallow(
            <Nav.Project
                selected={true}
                index={0}
                editing={editing}
                projectName={"My Project 3"}
                confirmingDelete={false}
                onProjectNameChange={projectNameChange}
                onSelectProject={selectProject}
                onDeleteProject={deleteProject}
                onConfirmingDelete={confirmingDelete}
                onEditingClick={editingClick}
            />
        );

        // Edit name button on click and enter creates new input
        projectWrapper.find("button").at(0).prop("onClick")();
        expect(editingClick).toHaveBeenCalledTimes(1);

        // Editing name with new input fires onChange handler with every new keystroke
        expect(projectWrapper.find(Nav.ProjectManagedInput)).toHaveLength(1);
        projectWrapper.find(Nav.ProjectManagedInput).prop("onChange")("newName");
        expect(projectNameChange).toHaveBeenLastCalledWith(0, "newName");

        projectWrapper.find("button").at(0).prop("onClick")();
        expect(editingClick).toHaveBeenCalledTimes(2);

        // Clicking/focus-entering save icon returns input to button
        expect(projectWrapper.find(Nav.ProjectManagedInput)).toHaveLength(0);
        expect(projectWrapper.find(Nav.ProjectSelectButton)).toHaveLength(1);
    });

    it("Delete button brings up confirmingDelete confirmation window", () => {
        const projectNameChange = jest.fn();
        const selectProject = jest.fn();
        const deleteProject = jest.fn();
        const confirmingDelete = jest.fn(() => {
            confirmingDeleteState = !confirmingDeleteState;
            projectWrapper.setProps({ confirmingDelete: confirmingDeleteState });
        });
        const editingClick = jest.fn();

        let confirmingDeleteState = false;
        const projectWrapper = shallow(
            <Nav.Project
                selected={true}
                index={0}
                editing={false}
                projectName={"My Project 3"}
                confirmingDelete={confirmingDeleteState}
                onProjectNameChange={projectNameChange}
                onSelectProject={selectProject}
                onDeleteProject={deleteProject}
                onConfirmingDelete={confirmingDelete}
                onEditingClick={editingClick}
            />
        );

        projectWrapper.find("button").at(1).prop("onClick")();
        expect(confirmingDelete).toHaveBeenCalled();
        expect(projectWrapper.find(Nav.ProjectConfirmDelete)).toHaveLength(1);
    });

    it("ProjectConfirmDelete disappears when escape is pressed while ProjectConfirmDelete is open", () => {
        const deleteProject = jest.fn();
        const confirmingDelete = jest.fn();
        const confirmDeleteWrapper = shallow(<Nav.ProjectConfirmDelete index={0} onDeleteProject={deleteProject} onConfirmingDelete={confirmingDelete} />);

        // Escape
        confirmDeleteWrapper.find(".project-delete").prop("onKeyDown")({ keyCode: 27 });
        expect(confirmingDelete).toHaveBeenLastCalledWith(-1);

        // Random non-escape key
        confirmDeleteWrapper.find(".project-delete").prop("onKeyDown")({ keyCode: 1 });
        expect(confirmingDelete).toHaveBeenCalledTimes(1);
    });
});
