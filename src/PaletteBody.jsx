import React from "react";
import SwatchSection from "./SwatchSection";

export default function PaletteBody(props) {
    return (
        <article>
            {Object.keys(props.swatches).map(swatchKey => {
                return (
                    <SwatchSection
                        key={swatchKey}
                        sectionName={swatchKey}
                        swatches={props.swatches[swatchKey]}
                        onAddSwatch={() => {
                            props.onAddSwatch(swatchKey);
                        }}
                        onChange={(index, newColor) => {
                            props.onChange(swatchKey, index, newColor);
                        }}
                        selection={props.selection.sectionName === swatchKey ? props.selection.index : undefined}
                        onSelectSwatch={index => {
                            props.onSelectSwatch({ sectionName: swatchKey, index });
                        }}
                    />
                );
            })}
        </article>
    );
}
