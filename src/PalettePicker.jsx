import React, { useState } from "react";
import Nav from "./Nav";
import PaletteHeader from "./PaletteHeader";
import PaletteBody from "./PaletteBody";
import convert from "color-convert";
import getColorDataFromHex from "./ColorUtils";

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
                    newSwatches[category][color] = { hex: prevSwatches[category][color].hex, colorData: getColorDataFromHex(prevSwatches[category][color].hex, newColorMode) };
                }
            }
            return newSwatches;
        });

        // Adjust the colorMode state
        setColorMode(newColorMode);
    };

    const getColorRotated = (colorHex, degreeClockwise) => {
        let hsl = convert.hex.hsl(colorHex);
        hsl[0] = hsl[0] + degreeClockwise;
        return convert.hsl.hex(hsl);
    };

    const startComplementaryColorHarmony = () => {
        setSwatches((prevSwatches) => {
            let newMainSwatches = {};
            if (prevSwatches.Main[1] === "#FFFFFF") {
                // First swatch is white, make it purple, so the line of complementary colors is straight up and down
                newMainSwatches[1] = "#9830FF";
                newMainSwatches[2] = "#9EFF3B";
            } else {
                newMainSwatches[1] = prevSwatches.Main[1];
                newMainSwatches[2] = getColorRotated(prevSwatches.Main[1]);
            }
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches.Main = newMainSwatches;
            return newSwatches;
        });
    };

    const changeColor = (sectionName, index, newColor) => {
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
