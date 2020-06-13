import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import PaletteHeader from "./PaletteHeader";
import PaletteBody from "./PaletteBody";
import CompareColors from "./CompareColors";
import ContrastCheck from "./ContrastCheck";
import NaturalCompare from "natural-compare-lite";
import * as colorUtils from "./ColorUtils";

export default function PalettePicker() {
    const [swatches, setSwatches] = useState({
        Main: {
            1: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            2: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            3: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            4: { hex: "#FFFFFF", colorData: [0, 0, 100] },
        },
    });
    const [colorMode, setColorMode] = useState("HSB");
    const [selection, setSelection] = useState({ sectionName: "Main", index: 1 });
    const [harmony, setHarmony] = useState("None");
    const [modal, setModal] = useState({ status: "hidden" });
    const [isNavOpen, setIsNavOpen] = useState(false);

    const [projects, setProjects] = useState(["My Project 1", "My Project 2"]);
    const [activeProject, setActiveProject] = useState(0);

    let pressedKeys = [];

    useEffect(() => {
        refreshProjectsListFromLocalData();
        refreshFromLocalData(activeProject);
    }, []);

    const toggleNav = () => {
        setIsNavOpen((prevIsNavOpen) => !prevIsNavOpen);
    };

    const setLocalStorage = (changedDataType, newData) => {
        let oldLocalStorage = JSON.parse(window.localStorage.getItem(projects[activeProject]));

        if (oldLocalStorage === null) {
            oldLocalStorage = { swatches, harmony, colorMode };
        }

        switch (changedDataType) {
            case "colorMode":
                oldLocalStorage.colorMode = newData;
                break;
            case "harmony":
                oldLocalStorage.harmony = newData;
                break;
            case "swatches":
                oldLocalStorage.swatches = newData;
                break;
        }

        window.localStorage.setItem(projects[activeProject], JSON.stringify(oldLocalStorage));
    };

    const refreshProjectsListFromLocalData = () => {
        let localStorageObjects = Object.keys(window.localStorage);
        if (localStorageObjects.length === 0) {
            localStorageObjects = ["My Project 1"];
        }
        localStorageObjects.sort(NaturalCompare);
        setProjects(localStorageObjects);
    };

    const refreshFromLocalData = (index) => {
        const storedJson = JSON.parse(window.localStorage.getItem(projects[index]));

        if (storedJson) {
            setColorMode(storedJson.colorMode);
            setHarmony(storedJson.harmony);
            setSwatches(storedJson.swatches);
        }
    };

    const onKeyDown = (e) => {
        // this could be a problem in the future, because it modifies the existing array instance rather than making a new one
        if (!pressedKeys.includes(e.keyCode)) {
            pressedKeys.push(e.keyCode);
        }
    };

    const onKeyUp = (e) => {
        pressedKeys = pressedKeys.filter((key) => key !== e.keyCode);
        e.preventDefault();
    };

    const setSaveSwatches = (callback) => {
        setSwatches((prevSwatches) => {
            const newSwatches = callback(prevSwatches);
            setLocalStorage("swatches", newSwatches);
            return newSwatches;
        });
    };

    const setSaveColorMode = (newColorMode) => {
        setColorMode(newColorMode);
        setLocalStorage("colorMode", newColorMode);
    };

    const recalculateColors = (newColorMode) => {
        setSaveSwatches((prevSwatches) => {
            // Loop through all the colors
            let newSwatches = {};
            for (const category of Object.keys(prevSwatches)) {
                newSwatches[category] = {};
                for (const color of Object.keys(prevSwatches[category])) {
                    // Change the colorData property of their object to reflect the new color mode
                    newSwatches[category][color] = { hex: prevSwatches[category][color].hex, colorData: colorUtils.getColorDataFromHex(prevSwatches[category][color].hex, newColorMode) };
                }
            }
            return newSwatches;
        });

        // Adjust the colorMode state
        setSaveColorMode(newColorMode);
    };

    const getFirstSectionName = (swatchList) => {
        return Object.keys(swatchList)[0];
    };

    const colorifyStartColorHarmony = (prevSwatches) => {
        if (prevSwatches[getFirstSectionName(prevSwatches)][1].hex === "#FFFFFF") {
            // First swatch is white, make it purple, so the line of complementary colors is straight up and down
            return { hex: "#9A33FF", colorData: colorUtils.getColorDataFromHex("#9A33FF", colorMode) };
        }
        // First swatch has actual color, create complementary colors from this
        return prevSwatches[getFirstSectionName(prevSwatches)][1];
    };

    const startRectangleColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[[getFirstSectionName(prevSwatches)]] = colorUtils.getRectangleColor(0, 70, 110, 80, 100, colorMode);

            return newSwatches;
        });
    };

    const startAnalogousColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            const rootColor = colorifyStartColorHarmony(prevSwatches);

            newSwatches[getFirstSectionName(prevSwatches)] = colorUtils.getHSBAnalogousColor(rootColor, 15, Object.keys(prevSwatches[getFirstSectionName(prevSwatches)]).length, colorMode);

            return newSwatches;
        });
    };

    const startComplementaryColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            const rootColor = colorifyStartColorHarmony(prevSwatches);

            newSwatches[getFirstSectionName(prevSwatches)] = {
                1: rootColor,
                2: colorUtils.getHSBComplementaryColor(rootColor, colorMode),
            };

            return newSwatches;
        });
    };

    const startTriadColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            const rootColor = colorifyStartColorHarmony(prevSwatches);

            const triadColors = colorUtils.getHSBTriadColor(rootColor, colorMode);

            newSwatches[getFirstSectionName(prevSwatches)] = {
                1: rootColor,
                2: triadColors[0],
                3: triadColors[1],
            };

            return newSwatches;
        });
    };

    const startSplitComplementaryColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            const rootColor = colorifyStartColorHarmony(prevSwatches);

            const splitColors = colorUtils.getHSBSplitComplementaryColor(rootColor, colorMode);

            newSwatches[getFirstSectionName(prevSwatches)] = {
                1: rootColor,
                2: splitColors[0],
                3: splitColors[1],
            };

            return newSwatches;
        });
    };

    const restrictRectangle = (index, newColor) => {
        setSaveSwatches((prevSwatches) => {
            const firstSectionName = getFirstSectionName(prevSwatches);
            const isShiftPressed = pressedKeys.includes(16);

            const prevColorHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][index].colorData, colorMode);
            const newColorHSB = colorUtils.getHSBFromColorData(newColor.colorData, colorMode);

            let hueDiff = colorUtils.getAbsoluteHueDiff(prevColorHSB, newColorHSB);

            // A in Q1, B in Q2, etc
            const aHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][1].colorData, colorMode);
            const bHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][2].colorData, colorMode);
            const cHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][3].colorData, colorMode);

            let arcOne = Math.abs(colorUtils.getAbsoluteHueDiff(bHSB, aHSB));
            let arcTwo = Math.abs(colorUtils.getAbsoluteHueDiff(cHSB, bHSB));

            let rotation = hueDiff + aHSB[0] - (90 - arcOne / 2);

            const isBetween = (number, lowerBound, upperBound) => {
                return number < upperBound && number > lowerBound;
            };

            if (isShiftPressed) {
                if (index === "1" || index === "3") {
                    if (isBetween(arcTwo + hueDiff * 2, 30, 150) && isBetween(arcOne - hueDiff * 2, 30, 150)) {
                        arcOne -= hueDiff * 2;
                        arcTwo += hueDiff * 2;
                    }
                } else {
                    if (isBetween(arcOne + hueDiff * 2, 30, 150) && isBetween(arcTwo - hueDiff * 2, 30, 150)) {
                        arcTwo -= hueDiff * 2;
                        arcOne += hueDiff * 2;
                    }
                }
                rotation -= hueDiff;
            }

            const newSectionSwatches = colorUtils.getRectangleColor(rotation, arcOne, arcTwo, newColorHSB[1], newColorHSB[2], colorMode);
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[firstSectionName] = newSectionSwatches;
            return newSwatches;
        });
    };

    const addAnalogousSwatch = () => {
        setSaveSwatches((prevSwatches) => {
            const firstSectionName = getFirstSectionName(prevSwatches);
            const indexOneHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][1].colorData, colorMode);
            const indexTwoHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][2].colorData, colorMode);

            const analogousHueDiff = colorUtils.getAbsoluteHueDiff(indexOneHSB, indexTwoHSB);

            const centerColorHSB = colorUtils.getCenterColorHSB(prevSwatches[firstSectionName], colorMode);
            const newSectionSwatches = colorUtils.getAnalogousColorFromHSBCenter(centerColorHSB, Math.abs(analogousHueDiff), Object.keys(prevSwatches[firstSectionName]).length + 1, colorMode);

            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[firstSectionName] = newSectionSwatches;
            return newSwatches;
        });
    };

    const restrictAnalogous = (index, newColor) => {
        setSaveSwatches((prevSwatches) => {
            const firstSectionName = getFirstSectionName(prevSwatches);
            const indexInt = parseInt(index);

            const colorLength = Object.keys(prevSwatches[firstSectionName]).length;

            const prevColorHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][index].colorData, colorMode);
            const newColorHSB = colorUtils.getHSBFromColorData(newColor.colorData, colorMode);

            let hueDiff = colorUtils.getAbsoluteHueDiff(prevColorHSB, newColorHSB);

            // There's probably a better way of doing this but my brain can't find it.
            // treatLike represents what colorLength the hueDiff adjustment should follow.
            // for an array of length 4:
            // 1 2 3 4     it returns
            // 4 2 2 4
            let treatLike = Math.ceil(Math.abs(colorLength / 2 + 0.5 - indexInt)) * 2;
            // If the number of nodes is odd, add one to the treatLike formula and it'll fit into the below formula exactly as if it were even.
            if (colorLength % 2 === 1) {
                treatLike++;
            }
            // this adjusts the real hue difference to actually follow the cursor's position
            // formula derived from:
            // o  o  |  o  o
            // (distance to next node)
            // 1  .5   .5  1
            // by just adding the difference, the calculation would not follow the cursor, because the hueDiff for the purposes of the analogous calculation scales by more than the cursor actually moved
            // ex:
            // in a 4 node analogous harmony, with hue values:
            // 100, 120, 140, 160 (logical center = 130)
            // moving the 160 node by +2 hue, would otherwise cause hueDiff to be increased by 2 (from 20 to 22), which would give the following values:
            // 97   119  141  163
            // this being a problem, because the user dragged the 160 node in reality to 162, so the following formula scales this back, so that this is true
            hueDiff = (hueDiff * 2) / (treatLike - 1);

            const indexOneHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][1].colorData, colorMode);
            const indexTwoHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][2].colorData, colorMode);

            let analogousHueDiff = colorUtils.getAbsoluteHueDiff(indexOneHSB, indexTwoHSB);
            if (indexInt > colorLength / 2 + 0.5) {
                // To the right of center
                // Moving hue right increases analogousHueDiff
                // Moving hue left decreases analogousHueDiff

                analogousHueDiff = analogousHueDiff + hueDiff;
            } else if (indexInt < colorLength / 2 + 0.5) {
                // To the left of center
                // Moving hue left increases analogousHueDiff
                // Moving hue right decreases analogousHueDiff

                analogousHueDiff = analogousHueDiff - hueDiff;
            }

            let newSectionSwatches = {};
            let centerColorHSB = colorUtils.getCenterColorHSB(prevSwatches[firstSectionName], colorMode);
            centerColorHSB[1] = newColorHSB[1];
            centerColorHSB[2] = newColorHSB[2];
            if (indexInt === colorLength / 2 + 0.5) {
                centerColorHSB[0] = newColorHSB[0];
            }
            newSectionSwatches = colorUtils.getAnalogousColorFromHSBCenter(centerColorHSB, Math.abs(analogousHueDiff), Object.keys(prevSwatches[firstSectionName]).length, colorMode);

            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[firstSectionName] = newSectionSwatches;
            return newSwatches;
        });
    };

    const restrictTriplets = (index, newColor, colorDataFunction, genericHarmonyFunction) => {
        setSaveSwatches((prevSwatches) => {
            const firstSectionName = getFirstSectionName(prevSwatches);
            let tripletColors;
            let indexOne;
            if (index !== "1") {
                // compare swatches[index] to newColor
                const prevColorHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][index].colorData, colorMode);
                const newColorHSB = colorUtils.getHSBFromColorData(newColor.colorData, colorMode);
                const hueDiff = colorUtils.getAbsoluteHueDiff(prevColorHSB, newColorHSB);

                const indexOneHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][1].colorData, colorMode);
                let indexOneColorData = indexOneHSB.concat();
                indexOneColorData[0] = (indexOneColorData[0] + hueDiff + 360) % 360;
                indexOneColorData[1] = newColorHSB[1];
                indexOneColorData[2] = newColorHSB[2];

                tripletColors = colorDataFunction(indexOneColorData, "HSB");
                tripletColors[0].colorData = colorUtils.getColorDataFromHex(tripletColors[0].hex, colorMode);
                tripletColors[1].colorData = colorUtils.getColorDataFromHex(tripletColors[1].hex, colorMode);

                const hex = colorUtils.getHexFromColorData(indexOneColorData, "HSB");
                indexOne = { hex: "#" + hex, colorData: colorUtils.getColorDataFromHex(hex, colorMode) };
            } else {
                indexOne = newColor;
                tripletColors = genericHarmonyFunction(newColor, colorMode);
            }

            let newSectionSwatches = {};
            newSectionSwatches[1] = indexOne;
            newSectionSwatches[2] = tripletColors[0];
            newSectionSwatches[3] = tripletColors[1];

            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[firstSectionName] = newSectionSwatches;
            return newSwatches;
        });
    };

    const restrictSplitComplementary = (index, newColor) => {
        restrictTriplets(index, newColor, colorUtils.getSplitComplementaryColorFromColorData, colorUtils.getHSBSplitComplementaryColor);
    };

    const restrictTriad = (index, newColor) => {
        restrictTriplets(index, newColor, colorUtils.getTriadColorFromColorData, colorUtils.getHSBTriadColor);
    };

    const restrictComplement = (index, newColor) => {
        const changeIndex = index === "1" ? 2 : 1;
        setSaveSwatches((prevSwatches) => {
            const firstSectionName = getFirstSectionName(prevSwatches);
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[firstSectionName][index] = newColor;
            newSwatches[firstSectionName][changeIndex] = colorUtils.getHSBComplementaryColor(newColor, colorMode);
            return newSwatches;
        });
    };

    const changeColor = (sectionName, index, newColor) => {
        switch (harmony) {
            case "Complementary":
                restrictComplement(index, newColor);
                break;
            case "Triad":
                restrictTriad(index, newColor);
                break;
            case "Split-Complementary":
                restrictSplitComplementary(index, newColor);
                break;
            case "Analogous":
                restrictAnalogous(index, newColor);
                break;
            case "Rectangle":
                restrictRectangle(index, newColor);
                break;
            default:
                setColor(sectionName, index, newColor);
        }
    };

    const setColor = (sectionName, index, newColor) => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[sectionName][index] = newColor;
            return newSwatches;
        });
    };

    const generateUniqueIndex = (sectionName) => {
        let uniqueIndex = 0;
        do {
            uniqueIndex = Date.now() * 10000 + Math.round(Math.random() * 10000);
        } while (uniqueIndex in swatches[sectionName]);
        return uniqueIndex;
    };

    const changeSectionName = (oldSection, newSection) => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.keys(prevSwatches).reduce((swatchObj, sectionName) => {
                if (sectionName !== oldSection) {
                    swatchObj[sectionName] = prevSwatches[sectionName];
                } else {
                    swatchObj[newSection] = prevSwatches[sectionName];
                }
                return swatchObj;
            }, {});
            return newSwatches;
        });
    };

    const addSwatchSection = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches["New Section " + (Object.keys(newSwatches).length + 1)] = { 1: { hex: "#FFFFFF", colorData: [0, 0, 100] } };
            return newSwatches;
        });
    };

    const addSwatch = (sectionName) => {
        if (sectionName === getFirstSectionName(swatches) && harmony !== "None") {
            if (harmony === "Analogous") {
                addAnalogousSwatch();
            }
            return;
        }

        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[sectionName][generateUniqueIndex(sectionName)] = { hex: "#FFFFFF", colorData: colorUtils.getColorDataFromHex("#FFFFFF", colorMode) };
            return newSwatches;
        });
    };

    const colorHarmony = (harmonyName) => {
        switch (harmonyName) {
            case "Complementary":
                startComplementaryColorHarmony();
                break;
            case "Triad":
                startTriadColorHarmony();
                break;
            case "Split-Complementary":
                startSplitComplementaryColorHarmony();
                break;
            case "Analogous":
                startAnalogousColorHarmony();
                break;
            case "Rectangle":
                startRectangleColorHarmony();
                break;
            default:
                break;
        }

        setHarmony(harmonyName);
        setLocalStorage("harmony", harmonyName);
    };

    const selectColor = (selectionObject) => {
        if (modal.status !== "selecting") {
            setSelection(selectionObject);
            return;
        }

        // prevents from comparing/contrasting 2 of the same color
        if (selectionObject.sectionName !== selection.sectionName || parseInt(selectionObject.index) !== parseInt(selection.index)) {
            setModal((prevModal) => {
                return { ...prevModal, status: "shown", selection: [selection, selectionObject] };
            });
        }
    };

    const compareColors = () => {
        setModal((prevModal) => {
            if (prevModal.type === "compare") {
                return { status: "hidden" };
            }
            return { status: "selecting", type: "compare" };
        });
    };

    const contrastChecker = () => {
        setModal((prevModal) => {
            if (prevModal.type === "contrast") {
                return { status: "hidden" };
            }
            return { status: "selecting", type: "contrast" };
        });
    };

    const exitModal = () => {
        setModal({ status: "hidden" });
    };

    const selectProject = (index) => {
        setActiveProject(index);
        refreshFromLocalData(index);
    };

    const projectNameChange = (index, newName) => {
        setProjects((prevProjects) => {
            const newProjects = prevProjects.concat();
            window.localStorage.removeItem(prevProjects[index]);
            window.localStorage.setItem(newName, JSON.stringify({ harmony, swatches, colorMode }));
            newProjects[index] = newName;
            return newProjects;
        });
    };

    const projectDelete = (index) => {
        setProjects((prevProjects) => {
            window.localStorage.removeItem(prevProjects[index]);
            const newProjects = prevProjects.filter((project, i) => i !== index);
            if (newProjects.length === 0) {
                addProject();
            }
            return newProjects;
        });
    };

    const addProject = () => {
        const newHarmony = "None";
        const newColorMode = "HSB";
        const newSwatches = {
            Main: {
                1: { hex: "#FFFFFF", colorData: [0, 0, 100] },
                2: { hex: "#FFFFFF", colorData: [0, 0, 100] },
                3: { hex: "#FFFFFF", colorData: [0, 0, 100] },
                4: { hex: "#FFFFFF", colorData: [0, 0, 100] },
            },
        };

        setSaveSwatches(newSwatches);
        setHarmony(newHarmony);
        setColorMode(newColorMode);

        setProjects((prevProjects) => {
            let newIndex = prevProjects.length;
            do {
                ++newIndex;
            } while (prevProjects.includes("My Project " + newIndex));

            const newProjects = prevProjects.concat();
            newProjects.push("My Project " + newIndex);
            window.localStorage.setItem("My Project " + newIndex, JSON.stringify({ harmony: newHarmony, swatches: newSwatches, colorMode: newColorMode }));
            return newProjects;
        });
    };

    return (
        <div className={isNavOpen ? "body body-fixed" : "body"} tabIndex={-1} onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
            <Nav isOpen={isNavOpen} toggleIsOpen={toggleNav} projects={projects} activeProject={activeProject} onSelectProject={selectProject} onProjectNameChange={projectNameChange} onDeleteProject={projectDelete} onAddProject={addProject} />
            <main>
                <PaletteHeader
                    swatches={swatches}
                    selection={selection}
                    colorMode={colorMode}
                    colorHarmony={harmony}
                    toolModal={modal}
                    onChange={changeColor}
                    onSelectSwatch={selectColor}
                    onCompareColors={compareColors}
                    onContrastChecker={contrastChecker}
                    onColorMode={recalculateColors}
                    onColorHarmony={colorHarmony}
                />
                <PaletteBody onSectionNameChange={changeSectionName} swatches={swatches} colorMode={colorMode} selection={selection} onSelectSwatch={selectColor} onAddSwatch={addSwatch} onAddSwatchSection={addSwatchSection} onChange={changeColor} />
            </main>
            {modal.status === "shown" && modal.type === "compare" && <CompareColors onModalClose={exitModal} colorMode={colorMode} swatches={swatches} selection={modal.selection} onChange={changeColor} />}
            {modal.status === "shown" && modal.type === "contrast" && <ContrastCheck onModalClose={exitModal} colorMode={colorMode} swatches={swatches} selection={modal.selection} onChange={changeColor} />}
        </div>
    );
}
