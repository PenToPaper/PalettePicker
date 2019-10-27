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
                        selected={props.selection == swatchKey}
                        colorMode={props.colorMode}
                        color={props.swatches[swatchKey]}
                        onChange={newColor => {
                            props.onChange(swatchKey, newColor);
                        }}
                        onSelect={() => {
                            props.onSelectSwatch(swatchKey);
                        }}
                    />
                );
            })}
            <AddSwatch onAddSwatch={props.onAddSwatch} />
        </section>
    );
}
