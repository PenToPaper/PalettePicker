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
                    />
                );
            })}
        </article>
    );
}
