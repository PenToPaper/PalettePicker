import React from "react";
import Swatch from "./Swatch";
import AddSwatch from "./AddSwatch";

export default function SwatchSection(props) {
    return (
        <section>
            <h1>{props.sectionName}</h1>
            {Object.keys(props.swatches).map(swatchKey => {
                return (
                    <Swatch
                        key={swatchKey}
                        selected={props.swatches[swatchKey].selected}
                        colorMode={props.colorMode}
                        color={props.swatches[swatchKey].color}
                        onColorChange={newColor => {
                            return props.onColorChange(swatchKey, newColor);
                        }}
                    />
                );
            })}
            <AddSwatch onAddSwatch={props.onAddSwatch} />
        </section>
    );
}
