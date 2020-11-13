import React, { useRef, useEffect } from "react";
import Swatch from "./Swatch";
import FocusTrap from "focus-trap-react";

export default function CompareColors(props) {
    const exit = useRef(null);

    useEffect(() => {
        exit.current.focus();
    }, []);

    const handleButtonKeyDown = (event) => {
        switch (event.keyCode) {
            // Escape
            case 27:
                props.onModalClose();
                break;
            default:
                return;
        }
    };

    return (
        <FocusTrap>
            <div className="compare-colors modal" role="dialog" aria-label="Compare Colors" aria-modal="true" onKeyDown={handleButtonKeyDown}>
                <button className="modal-exit" aria-label="Exit Compare Colors" ref={exit} onClick={props.onModalClose}></button>
                <div className="phone-compare-colors-wrapper">
                    <div style={{ backgroundColor: props.swatches[props.selection[0].sectionName][props.selection[0].index].hex }}></div>
                    <div style={{ backgroundColor: props.swatches[props.selection[1].sectionName][props.selection[1].index].hex }}></div>
                </div>
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
        </FocusTrap>
    );
}
