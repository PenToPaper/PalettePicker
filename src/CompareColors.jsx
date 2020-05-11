import React from "react";
import Swatch from "./Swatch";

export default function CompareColors(props) {
    return (
        <div className="compare-colors modal" role="dialog" aria-label="Compare Colors" aria-modal="true">
            <button className="modal-exit" aria-label="Exit Compare Colors" onClick={props.onModalClose}></button>
            <Swatch
                selected={false}
                colorMode={props.colorMode}
                color={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                onChange={(newColor) => {
                    props.onChange(props.selection[0].sectionName, props.selection[0].index, newColor);
                }}
                onSelect={() => {}}
            />
            <Swatch
                selected={false}
                colorMode={props.colorMode}
                color={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                onChange={(newColor) => {
                    props.onChange(props.selection[1].sectionName, props.selection[1].index, newColor);
                }}
                onSelect={() => {}}
            />
        </div>
    );
}
