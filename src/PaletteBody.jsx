import React from "react";
import SwatchSection from "./SwatchSection";
import AddSwatchSection from "./AddSwatchSection";

export default function PaletteBody(props) {
    // Key = index is not ideal but because sections cant be re-ordered, it should be fine
    return (
        <article>
            {Object.keys(props.swatches).map((swatchKey, index) => {
                return (
                    <SwatchSection
                        colorMode={props.colorMode}
                        key={index}
                        sectionName={swatchKey}
                        swatches={props.swatches[swatchKey]}
                        onAddSwatch={() => {
                            props.onAddSwatch(swatchKey);
                        }}
                        onSectionNameChange={props.onSectionNameChange}
                        onChange={(index, newColor) => {
                            props.onChange(swatchKey, index, newColor);
                        }}
                        selection={props.selection.sectionName === swatchKey ? props.selection.index : undefined}
                        onSelectSwatch={(index) => {
                            props.onSelectSwatch({ sectionName: swatchKey, index });
                        }}
                    />
                );
            })}
            <AddSwatchSection onClick={props.onAddSwatchSection} />
        </article>
    );
}
