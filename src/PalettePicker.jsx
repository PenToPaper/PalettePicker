import React, { useState } from "react";
import Nav from "./Nav";
import PaletteHeader from "./PaletteHeader";
import PaletteBody from "./PaletteBody";
import convert from "color-convert";

export default function PalettePicker() {
    const [swatches, setSwatches] = useState({
        Main: {
            1: "#FFFFFF",
            2: "#FFFFFF",
            3: "#FFFFFF",
            4: "#FFFFFF"
        }
    });
    const [colorMode, setColorMode] = useState("HSB");
    const [selection, setSelection] = useState({ sectionName: "Main", index: 1 });
    const [harmony, setHarmony] = useState("None");

    const getColorRotated = (colorHex, degreeClockwise) => {
        let hsl = convert.hex.hsl(colorHex);
        hsl[0] = hsl[0] + degreeClockwise;
        return convert.hsl.hex(hsl);
    };

    const startComplementaryColorHarmony = () => {
        setSwatches(prevSwatches => {
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

    const changeColor = (sectionName, index, newColorHex) => {
        setSwatches(prevSwatches => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[sectionName][index] = newColorHex;
            return newSwatches;
        });
    };

    const generateUniqueIndex = sectionName => {
        let uniqueIndex = 0;
        do {
            uniqueIndex = Date.now() * 10000 + Math.round(Math.random() * 10000);
        } while (uniqueIndex in swatches[sectionName]);
        return uniqueIndex;
    };

    const addSwatch = sectionName => {
        setSwatches(prevSwatches => {
            const newSwatches = Object.assign({}, prevSwatches);
            newSwatches[sectionName][generateUniqueIndex(sectionName)] = "#FFFFFF";
            return newSwatches;
        });
    };

    const compareColors = () => {};
    const contrastChecker = () => {};
    const colorHarmony = harmonyName => {
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
                    onChange={changeColor}
                    onSelectSwatch={setSelection}
                    onCompareColors={compareColors}
                    onContrastChecker={contrastChecker}
                    onColorMode={setColorMode}
                    onColorHarmony={colorHarmony}
                />
                <PaletteBody swatches={swatches} colorMode={colorMode} selection={selection} onSelectSwatch={setSelection} onAddSwatch={addSwatch} onChange={changeColor} />
            </main>
        </div>
    );
}
