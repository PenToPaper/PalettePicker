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
    const [bodyOffsetRight, setBodyOffsetRight] = useState(false);

    const [projects, setProjects] = useState(["My Project 1", "My Project 2"]);
    const [activeProject, setActiveProject] = useState(0);

    let pressedKeys = [];

    useEffect(() => {
        refreshProjectsListFromLocalData();
        refreshFromLocalData(activeProject);
    }, []);

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
            case "selection":
                oldLocalStorage.selection = newData;
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
            setSelection(storedJson.selection);
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

    const setSaveSelection = (newSelection) => {
        if (typeof newSelection === "function") {
            setSelection((prevSelection) => {
                const newSelectionCallback = newSelection(prevSelection);
                setLocalStorage("selection", newSelectionCallback);
                return newSelectionCallback;
            });
        } else {
            setSelection(newSelection);
            setLocalStorage("selection", newSelection);
        }
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
        const sectionOne = getFirstSectionName(prevSwatches);
        const indexOne = getSwatchIndexFromSimpleIndex(sectionOne, 0, prevSwatches);
        if (prevSwatches[getFirstSectionName(prevSwatches)][indexOne].hex === "#FFFFFF") {
            // First swatch is white, make it purple, so the line of complementary colors is straight up and down
            return { hex: "#9A33FF", colorData: colorUtils.getColorDataFromHex("#9A33FF", colorMode) };
        }
        // First swatch has actual color, create complementary colors from this
        return prevSwatches[sectionOne][indexOne];
    };

    const getSwatchIndexFromSimpleIndex = (sectionName, simpleIndex, swatchesInstance = null) => {
        if (swatchesInstance === null) {
            return Object.keys(swatches[sectionName])[simpleIndex];
        }
        return Object.keys(swatchesInstance[sectionName])[simpleIndex];
    };

    const getSimpleZeroIndexFromSwatchIndex = (sectionName, index, swatchesInstance = null) => {
        if (swatchesInstance === null) {
            return Object.keys(swatches[sectionName]).indexOf(index);
        }
        return Object.keys(swatchesInstance[sectionName]).indexOf(index);
    };

    const startRectangleColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const firstSection = getFirstSectionName(prevSwatches);
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[firstSection] = colorUtils.getRectangleColor(0, 70, 110, 80, 100, colorMode);

            setSaveSelection((prevSelection) => {
                if (prevSelection.sectionName === firstSection) {
                    const prevInt = getSimpleZeroIndexFromSwatchIndex(firstSection, prevSelection.index, prevSwatches);
                    if (prevInt > -1 && prevInt < 4) {
                        return { sectionName: prevSelection.sectionName, index: (prevInt + 1).toString() };
                    } else {
                        return { sectionName: prevSelection.sectionName, index: "1" };
                    }
                }
                return prevSelection;
            });

            return newSwatches;
        });
    };

    const startAnalogousColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const firstSection = getFirstSectionName(prevSwatches);
            const newSwatches = Object.assign({}, prevSwatches);
            const rootColor = colorifyStartColorHarmony(prevSwatches);

            newSwatches[firstSection] = colorUtils.getHSBAnalogousColor(rootColor, 15, Object.keys(prevSwatches[firstSection]).length, colorMode);

            setSaveSelection((prevSelection) => {
                if (prevSelection.sectionName === firstSection) {
                    const prevInt = getSimpleZeroIndexFromSwatchIndex(firstSection, prevSelection.index, prevSwatches);
                    if (prevInt > -1 && prevInt < Object.keys(prevSwatches[firstSection]).length + 1) {
                        return { sectionName: prevSelection.sectionName, index: (prevInt + 1).toString() };
                    } else {
                        return { sectionName: prevSelection.sectionName, index: "1" };
                    }
                }
                return prevSelection;
            });

            return newSwatches;
        });
    };

    const startComplementaryColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            const rootColor = colorifyStartColorHarmony(prevSwatches);
            const firstSection = getFirstSectionName(prevSwatches);

            newSwatches[firstSection] = {
                1: rootColor,
                2: colorUtils.getHSBComplementaryColor(rootColor, colorMode),
            };

            setSaveSelection((prevSelection) => {
                if (prevSelection.sectionName === firstSection) {
                    const prevInt = getSimpleZeroIndexFromSwatchIndex(firstSection, prevSelection.index, prevSwatches);
                    if (prevInt > -1 && prevInt < 2) {
                        return { sectionName: prevSelection.sectionName, index: (prevInt + 1).toString() };
                    } else {
                        return { sectionName: prevSelection.sectionName, index: "1" };
                    }
                }
                return prevSelection;
            });

            return newSwatches;
        });
    };

    const startTriadColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            const rootColor = colorifyStartColorHarmony(prevSwatches);
            const firstSection = getFirstSectionName(prevSwatches);

            const triadColors = colorUtils.getHSBTriadColor(rootColor, colorMode);

            newSwatches[firstSection] = {
                1: rootColor,
                2: triadColors[0],
                3: triadColors[1],
            };

            setSaveSelection((prevSelection) => {
                if (prevSelection.sectionName === firstSection) {
                    const prevInt = getSimpleZeroIndexFromSwatchIndex(firstSection, prevSelection.index, prevSwatches);
                    if (prevInt > -1 && prevInt < 3) {
                        return { sectionName: prevSelection.sectionName, index: (prevInt + 1).toString() };
                    } else {
                        return { sectionName: prevSelection.sectionName, index: "1" };
                    }
                }
                return prevSelection;
            });

            return newSwatches;
        });
    };

    const startSplitComplementaryColorHarmony = () => {
        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            const rootColor = colorifyStartColorHarmony(prevSwatches);
            const firstSection = getFirstSectionName(prevSwatches);

            const splitColors = colorUtils.getHSBSplitComplementaryColor(rootColor, colorMode);

            newSwatches[firstSection] = {
                1: rootColor,
                2: splitColors[0],
                3: splitColors[1],
            };

            setSaveSelection((prevSelection) => {
                if (prevSelection.sectionName === firstSection) {
                    const prevInt = getSimpleZeroIndexFromSwatchIndex(firstSection, prevSelection.index, prevSwatches);
                    if (prevInt > -1 && prevInt < 3) {
                        return { sectionName: prevSelection.sectionName, index: (prevInt + 1).toString() };
                    } else {
                        return { sectionName: prevSelection.sectionName, index: "1" };
                    }
                }
                return prevSelection;
            });

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

    const deleteAnalogousSwatch = () => {
        setSaveSwatches((prevSwatches) => {
            const firstSectionName = getFirstSectionName(prevSwatches);
            const indexOneHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][1].colorData, colorMode);
            const indexTwoHSB = colorUtils.getHSBFromColorData(prevSwatches[firstSectionName][2].colorData, colorMode);

            const analogousHueDiff = colorUtils.getAbsoluteHueDiff(indexOneHSB, indexTwoHSB);

            const centerColorHSB = colorUtils.getCenterColorHSB(prevSwatches[firstSectionName], colorMode);
            const newSectionSwatches = colorUtils.getAnalogousColorFromHSBCenter(centerColorHSB, Math.abs(analogousHueDiff), Object.keys(prevSwatches[firstSectionName]).length - 1, colorMode);

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

            let analogousHueDiff = Math.abs(colorUtils.getAbsoluteHueDiff(indexOneHSB, indexTwoHSB));
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

            if (analogousHueDiff < 0.5) {
                analogousHueDiff = 0.5;
            }

            let newSectionSwatches = {};
            let centerColorHSB = colorUtils.getCenterColorHSB(prevSwatches[firstSectionName], colorMode);
            centerColorHSB[1] = newColorHSB[1];
            centerColorHSB[2] = newColorHSB[2];
            if (indexInt === colorLength / 2 + 0.5) {
                centerColorHSB[0] = newColorHSB[0];
            }

            // Break in case of bug
            // console.log(indexOneHSB[0], indexTwoHSB[0], colorUtils.getAbsoluteHueDiff(indexOneHSB, indexTwoHSB), analogousHueDiff, centerColorHSB);

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
        const firstSectionName = getFirstSectionName(swatches);
        if (sectionName !== firstSectionName) {
            setColor(sectionName, index, newColor);
            return;
        }

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

    const changeSectionName = (oldSection, newSection) => {
        // If the newSection name doesn't already exist
        if (!Object.keys(swatches).includes(newSection)) {
            setSaveSelection((prevSelection) => {
                if (prevSelection.sectionName === oldSection) {
                    const newSelection = Object.assign(prevSelection);
                    newSelection.sectionName = newSection;
                    return newSelection;
                }
                return prevSelection;
            });

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
        }
    };

    const addSwatchSection = () => {
        const generateUniqueIndex = (prevSwatches) => {
            const swatchKeys = Object.keys(prevSwatches);
            let uniqueIndex = swatchKeys.length;
            do {
                uniqueIndex++;
            } while (swatchKeys.includes(`New Section ${uniqueIndex}`));
            return `New Section ${uniqueIndex}`;
        };

        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            const newSwatchSectionName = generateUniqueIndex(prevSwatches);
            newSwatches[newSwatchSectionName] = { 1: colorUtils.getRandomColor(colorMode) };
            return newSwatches;
        });
    };

    const addSwatch = (sectionName) => {
        const generateUniqueIndex = (prevSwatches, sectionName) => {
            let uniqueIndex = 0;
            do {
                uniqueIndex = Date.now() * 10000 + Math.round(Math.random() * 10000);
            } while (uniqueIndex in prevSwatches[sectionName]);
            return uniqueIndex;
        };

        if (sectionName === getFirstSectionName(swatches) && harmony !== "None") {
            if (harmony === "Analogous") {
                addAnalogousSwatch();
            }
            return;
        }

        setSaveSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[sectionName][generateUniqueIndex(prevSwatches, sectionName)] = colorUtils.getRandomColor(colorMode, prevSwatches[sectionName]);
            return newSwatches;
        });
    };

    const deleteSwatch = (sectionName, swatchIndex) => {
        if (Object.keys(swatches[sectionName]).length > 1) {
            if (harmony === "None" || getFirstSectionName(swatches) !== sectionName) {
                const updateSelection = (newSwatches) => {
                    setSaveSelection((prevSelection) => {
                        if (prevSelection.sectionName === sectionName && prevSelection.index === swatchIndex) {
                            const newSelection = Object.assign(prevSelection);
                            newSelection.index = Object.keys(newSwatches[sectionName])[0];
                            return newSelection;
                        }
                        return prevSelection;
                    });
                };

                setSaveSwatches((prevSwatches) => {
                    const newSwatches = Object.assign({}, prevSwatches);
                    delete newSwatches[sectionName][swatchIndex];
                    updateSelection(newSwatches);
                    return newSwatches;
                });
            } else if (harmony === "Analogous" && Object.keys(swatches[sectionName]).length > 2) {
                deleteAnalogousSwatch();
            }
        }
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
            setSaveSelection(selectionObject);
            return;
        }

        // prevents from comparing/contrasting 2 of the same color
        if (selectionObject.sectionName !== selection.sectionName || parseInt(selectionObject.index) !== parseInt(selection.index)) {
            toggleBodyModalState(true);
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
        toggleBodyModalState(false);
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
            if (index === activeProject) {
                selectProject(0);
            }
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
                1: colorUtils.getRandomColor("HSB"),
                2: colorUtils.getRandomColor("HSB"),
                3: colorUtils.getRandomColor("HSB"),
                4: colorUtils.getRandomColor("HSB"),
            },
        };
        const newSelection = {
            sectionName: "Main",
            index: "1",
        };

        setSwatches(newSwatches);
        setHarmony(newHarmony);
        setColorMode(newColorMode);

        setProjects((prevProjects) => {
            let newIndex = prevProjects.length;
            do {
                ++newIndex;
            } while (prevProjects.includes("My Project " + newIndex));

            const newProjects = prevProjects.concat();
            newProjects.push("My Project " + newIndex);
            window.localStorage.setItem("My Project " + newIndex, JSON.stringify({ selection: newSelection, harmony: newHarmony, swatches: newSwatches, colorMode: newColorMode }));
            setActiveProject(newProjects.length - 1);
            return newProjects;
        });
    };

    const deleteSwatchSection = (sectionName) => {
        if (Object.keys(swatches).length > 1) {
            if (Object.keys(swatches).indexOf(sectionName) === 0 && harmony !== "None") {
                // Update harmony to none, and delete swatch section
                setHarmony("None");
                setLocalStorage("harmony", "None");
            }

            const updateSelection = (newSwatches) => {
                setSaveSelection((prevSelection) => {
                    if (prevSelection.sectionName === sectionName) {
                        const newSection = Object.keys(newSwatches)[0];
                        const newIndex = Object.keys(newSwatches[newSection])[0];
                        return { sectionName: newSection, index: newIndex };
                    }
                    return prevSelection;
                });
            };

            setSaveSwatches((prevSwatches) => {
                const newSwatches = Object.assign({}, prevSwatches);
                delete newSwatches[sectionName];
                updateSelection(newSwatches);
                return newSwatches;
            });
        }
    };

    const toggleBodyModalState = (modalOpen) => {
        if (modalOpen) {
            const bodyOffset = window.innerWidth - document.body.offsetWidth;
            setBodyOffsetRight(bodyOffset + "px");
        } else {
            setBodyOffsetRight(false);
        }
    };

    return (
        <div className={bodyOffsetRight ? "body body-fixed" : "body"} tabIndex={-1} onKeyDown={onKeyDown} onKeyUp={onKeyUp} style={{ paddingRight: bodyOffsetRight }}>
            <Nav toggle={toggleBodyModalState} projects={projects} activeProject={activeProject} onSelectProject={selectProject} onProjectNameChange={projectNameChange} onDeleteProject={projectDelete} onAddProject={addProject} />
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
                    onAddSwatchSection={addSwatchSection}
                    projectName={projects[activeProject]}
                />
                <PaletteBody
                    onDeleteSwatch={deleteSwatch}
                    onSectionNameChange={changeSectionName}
                    swatches={swatches}
                    colorMode={colorMode}
                    selection={selection}
                    onSelectSwatch={selectColor}
                    onAddSwatch={addSwatch}
                    onAddSwatchSection={addSwatchSection}
                    onDeleteSwatchSection={deleteSwatchSection}
                    onChange={changeColor}
                />
            </main>
            {modal.status === "shown" && modal.type === "compare" && <CompareColors onModalClose={exitModal} colorMode={colorMode} swatches={swatches} selection={modal.selection} onChange={changeColor} />}
            {modal.status === "shown" && modal.type === "contrast" && <ContrastCheck onModalClose={exitModal} colorMode={colorMode} swatches={swatches} selection={modal.selection} onChange={changeColor} />}
        </div>
    );
}
