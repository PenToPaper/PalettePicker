import React from "react";
import Swatch from "./Swatch";
import AddSwatch from "./AddSwatch";

export default function SwatchSection(props) {
    return (
        <section id={props.sectionName}>
            <div className="swatch-section-header">
                <input
                    value={props.sectionName}
                    onChange={(e) => {
                        props.onSectionNameChange(props.sectionName, e.target.value);
                    }}
                />
                <button
                    aria-label="Delete Swatch Section"
                    onClick={(event) => {
                        event.stopPropagation();
                        props.onDeleteSwatchSection(props.sectionName);
                    }}
                >
                    <img src="/assets/materialicons/material_delete_offblack.svg" alt="" />
                </button>
            </div>
            {Object.keys(props.swatches).map((swatchKey) => {
                return (
                    <Swatch
                        key={swatchKey}
                        selected={props.selection == swatchKey}
                        deleteButton={true}
                        onDeleteSwatch={() => props.onDeleteSwatch(props.sectionName, swatchKey)}
                        colorMode={props.colorMode}
                        color={props.swatches[swatchKey]}
                        onChange={(newColor) => {
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
