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

    const colorifyStartColorHarmony = (prevSwatches) => {
        if (prevSwatches.Main[1].hex === "#FFFFFF") {
            // First swatch is white, make it purple, so the line of complementary colors is straight up and down
            return { hex: "#9A33FF", colorData: colorUtils.getColorDataFromHex("#9A33FF", colorMode) };
        }
        // First swatch has actual color, create complementary colors from this
        return prevSwatches.Main[1];
    };

    const startAnalogousColorHarmony = () => {
        setSwatches((prevSwatches) => {
            let newMainSwatches = {};
            newMainSwatches[1] = colorifyStartColorHarmony(prevSwatches);
            newMainSwatches = colorUtils.getHSBAnalogousColor(newMainSwatches[1], 15, Object.keys(prevSwatches.Main).length, colorMode);

            return { Main: newMainSwatches };
        });
    };

    const startComplementaryColorHarmony = () => {
        setSwatches((prevSwatches) => {
            let newMainSwatches = {};
            newMainSwatches[1] = colorifyStartColorHarmony(prevSwatches);
            newMainSwatches[2] = colorUtils.getHSBComplementaryColor(newMainSwatches[1], colorMode);

            return { Main: newMainSwatches };
        });
    };

    const startTriadColorHarmony = () => {
        setSwatches((prevSwatches) => {
            let newMainSwatches = {};

            newMainSwatches[1] = colorifyStartColorHarmony(prevSwatches);

            const triadColors = colorUtils.getHSBTriadColor(newMainSwatches[1], colorMode);
            newMainSwatches[2] = triadColors[0];
            newMainSwatches[3] = triadColors[1];

            return { Main: newMainSwatches };
        });
    };

    const startSplitComplementaryColorHarmony = () => {
        setSwatches((prevSwatches) => {
            let newMainSwatches = {};
            newMainSwatches[1] = colorifyStartColorHarmony(prevSwatches);

            const splitColors = colorUtils.getHSBSplitComplementaryColor(newMainSwatches[1], colorMode);
            newMainSwatches[2] = splitColors[0];
            newMainSwatches[3] = splitColors[1];

            return { Main: newMainSwatches };
        });
    };

    const restrictAnalogous = (index, newColor) => {
        const indexInt = parseInt(index);

        const colorLength = Object.keys(swatches.Main).length;

        const prevColorHSB = colorUtils.getHSBFromColorData(swatches.Main[index].colorData, colorMode);
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

        const indexOneHSB = colorUtils.getHSBFromColorData(swatches.Main[1].colorData, colorMode);
        const indexTwoHSB = colorUtils.getHSBFromColorData(swatches.Main[2].colorData, colorMode);

        let analogousHueDiff = indexTwoHSB[0] - indexOneHSB[0];
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

        setSwatches((prevSwatches) => {
            let newMainSwatches = {};
            let centerColorHSB = colorUtils.getCenterColorHSB(prevSwatches.Main, colorMode);
            centerColorHSB[1] = newColorHSB[1];
            centerColorHSB[2] = newColorHSB[2];
            if (indexInt === colorLength / 2 + 0.5) {
                centerColorHSB[0] = newColorHSB[0];
            }
            newMainSwatches = colorUtils.getAnalogousColorFromHSBCenter(centerColorHSB, Math.abs(analogousHueDiff), Object.keys(prevSwatches.Main).length, colorMode);

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
            const hueDiff = colorUtils.getAbsoluteHueDiff(prevColorHSB, newColorHSB);

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
            case "Analogous":
                restrictAnalogous(index, newColor);
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
            newSwatches[sectionName][generateUniqueIndex(sectionName)] = { hex: "#FFFFFF", colorData: colorUtils.getColorDataFromHex("#FFFFFF", colorMode) };
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
            case "Analogous":
                startAnalogousColorHarmony();
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
