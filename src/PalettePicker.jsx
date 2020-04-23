import React, { useState } from "react";
import Nav from "./Nav";
import PaletteHeader from "./PaletteHeader";
import PaletteBody from "./PaletteBody";
import convert from "color-convert";
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

    const recalculateColors = (newColorMode) => {
        setSwatches((prevSwatches) => {
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
        setColorMode(newColorMode);
    };

    const startComplementaryColorHarmony = () => {
        setSwatches((prevSwatches) => {
            let newMainSwatches = {};
            if (prevSwatches.Main[1].hex === "#FFFFFF") {
                // First swatch is white, make it purple, so the line of complementary colors is straight up and down
                newMainSwatches[1] = { hex: "#9A33FF", colorData: colorUtils.getColorDataFromHex("#9A33FF", colorMode) };
            } else {
                // First swatch has actual color, create complementary colors from this
                newMainSwatches[1] = prevSwatches.Main[1];
            }
            newMainSwatches[2] = colorUtils.getHSBComplementaryColor(newMainSwatches[1], colorMode);

            return { Main: newMainSwatches };
        });
    };

    const startTriadColorHarmony = () => {
        setSwatches((prevSwatches) => {
            let newMainSwatches = {};
            if (prevSwatches.Main[1].hex === "#FFFFFF") {
                // First swatch is white, make it purple, so the line of complementary colors is straight up and down
                newMainSwatches[1] = { hex: "#9A33FF", colorData: colorUtils.getColorDataFromHex("#9A33FF", colorMode) };
            } else {
                // First swatch has actual color, create complementary colors from this
                newMainSwatches[1] = prevSwatches.Main[1];
            }
            const triadColors = colorUtils.getHSBTriadColor(newMainSwatches[1], colorMode);
            newMainSwatches[2] = triadColors[0];
            newMainSwatches[3] = triadColors[1];

            return { Main: newMainSwatches };
        });
    };

    const startSplitComplementaryColorHarmony = () => {
        setSwatches((prevSwatches) => {
            let newMainSwatches = {};
            if (prevSwatches.Main[1].hex === "#FFFFFF") {
                // First swatch is white, make it purple, so the line of complementary colors is straight up and down
                newMainSwatches[1] = { hex: "#9A33FF", colorData: colorUtils.getColorDataFromHex("#9A33FF", colorMode) };
            } else {
                // First swatch has actual color, create complementary colors from this
                newMainSwatches[1] = prevSwatches.Main[1];
            }
            const splitColors = colorUtils.getHSBSplitComplementaryColor(newMainSwatches[1], colorMode);
            newMainSwatches[2] = splitColors[0];
            newMainSwatches[3] = splitColors[1];

            return { Main: newMainSwatches };
        });
    };

    const restrictTriplets = (index, newColor, colorDataFunction, genericHarmonyFunction) => {
        let tripletColors;
        let indexOne;
        if (index !== "1") {
            // compare swatches[index] to newColor
            const prevColorHSB = colorUtils.getHSBFromColorData(swatches.Main[index].colorData, colorMode);
            const newColorHSB = colorUtils.getHSBFromColorData(newColor.colorData, colorMode);
            const hueDiff = newColorHSB[0] - prevColorHSB[0];

            const indexOneHSB = colorUtils.getHSBFromColorData(swatches.Main[1].colorData, colorMode);
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

        setSwatches(() => {
            let newMainSwatches = {};
            newMainSwatches[1] = indexOne;
            newMainSwatches[2] = tripletColors[0];
            newMainSwatches[3] = tripletColors[1];

            return { Main: newMainSwatches };
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
        setSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches.Main[index] = newColor;
            newSwatches.Main[changeIndex] = colorUtils.getHSBComplementaryColor(newColor, colorMode);
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
            default:
                setColor(sectionName, index, newColor);
        }
    };

    const setColor = (sectionName, index, newColor) => {
        setSwatches((prevSwatches) => {
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

    const addSwatch = (sectionName) => {
        setSwatches((prevSwatches) => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[sectionName][generateUniqueIndex(sectionName)] = "#FFFFFF";
            return newSwatches;
        });
    };

    const compareColors = () => {};
    const contrastChecker = () => {};
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
            default:
                break;
        }

        setHarmony(harmonyName);
    };

    return (
        <div className="body">
            <Nav />
            <main>
                <PaletteHeader
                    swatches={swatches}
                    selection={selection}
                    colorMode={colorMode}
                    onChange={changeColor}
                    onSelectSwatch={setSelection}
                    onCompareColors={compareColors}
                    onContrastChecker={contrastChecker}
                    onColorMode={recalculateColors}
                    onColorHarmony={colorHarmony}
                />
                <PaletteBody swatches={swatches} colorMode={colorMode} selection={selection} onSelectSwatch={setSelection} onAddSwatch={addSwatch} onChange={changeColor} />
            </main>
        </div>
    );
}
