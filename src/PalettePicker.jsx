import React, { useState } from "react";
import Nav from "./Nav";
import PaletteHeader from "./PaletteHeader";
import PaletteBody from "./PaletteBody";

export default function PalettePicker() {
    const [swatches, setSwatches] = useState({
        Main: {
            1: "#ffffff",
            2: "#ffffff",
            3: "#ffffff",
            4: "#ffffff"
        }
    });
    const [colorMode, setColorMode] = useState("hsb");
    const [selection, setSelection] = useState({ sectionName: "Main", index: 1 });

    const changeColor = (sectionName, index, newColorHex) => {
        setSwatches(prevSwatches => {
            prevSwatches[sectionName][index] = newColorHex;
            return prevSwatches;
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
            prevSwatches[sectionName][generateUniqueIndex(sectionName)] = "#ffffff";
            return prevSwatches;
        });
    };

    const compareColors = () => {};
    const contrastChecker = () => {};
    const colorHarmony = () => {};

    return (
        <div className="body">
            <Nav />
            <main>
                <PaletteHeader swatches={swatches} selection={selection} onChange={changeColor} onCompareColors={compareColors} onContrastChecker={contrastChecker} onColorMode={setColorMode} onColorHarmony={colorHarmony} />
                <PaletteBody swatches={swatches} colorMode={colorMode} selection={selection} onSelectSwatch={setSelection} onAddSwatch={addSwatch} onChange={changeColor} />
            </main>
        </div>
    );
}
