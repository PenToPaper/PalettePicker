import React, { useRef, useEffect } from "react";
import Swatch from "./Swatch";
import { getWCAGContrast } from "./ColorUtils.js";
import FocusTrap from "focus-trap-react";

export default function ContrastCheck(props) {
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
        }
    };

    const wcagContrast = getWCAGContrast(props.swatches[props.selection[0].sectionName][props.selection[0].index], props.swatches[props.selection[1].sectionName][props.selection[1].index], props.colorMode);

    return (
        <FocusTrap>
            <div className="contrast-checker modal" role="dialog" aria-label="Contrast Checker" aria-modal="true" onKeyDown={handleButtonKeyDown}>
                <button className="modal-exit" aria-label="Exit Contrast Checker" ref={exit} onClick={props.onModalClose}>
                    <img src="/assets/materialicons/material_close_offblack.svg" alt="" />
                </button>
                <div className="contrast-checker-left">
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
                <div className="contrast-checker-right">
                    <h2>{`${Math.round(1000 * wcagContrast) / 1000}:1`}</h2>
                    <h3>Normal Text</h3>
                    <div className={wcagContrast >= 4.5 ? "standard-met" : "standard-not-met"}>
                        {wcagContrast >= 4.5 ? <img src="/assets/materialicons/material_check_icongreen.svg" alt="Check" /> : <img src="/assets/materialicons/material_close_iconred.svg" alt="Standard Not Met" />}
                        <span className="standard-name">WCAG AA</span>
                        <span className="contrast-standard">4.5:1</span>
                    </div>
                    <div className={wcagContrast >= 7 ? "standard-met" : "standard-not-met"}>
                        {wcagContrast >= 7 ? <img src="/assets/materialicons/material_check_icongreen.svg" alt="Check" /> : <img src="/assets/materialicons/material_close_iconred.svg" alt="Standard Not Met" />}
                        <span className="standard-name">WCAG AAA</span>
                        <span className="contrast-standard">7:1</span>
                    </div>
                    <h3>Large Text</h3>
                    <div className={wcagContrast >= 3 ? "standard-met" : "standard-not-met"}>
                        {wcagContrast >= 3 ? <img src="/assets/materialicons/material_check_icongreen.svg" alt="Check" /> : <img src="/assets/materialicons/material_close_iconred.svg" alt="Standard Not Met" />}
                        <span className="standard-name">WCAG AA</span>
                        <span className="contrast-standard">3:1</span>
                    </div>
                    <div className={wcagContrast >= 4.5 ? "standard-met" : "standard-not-met"}>
                        {wcagContrast >= 4.5 ? <img src="/assets/materialicons/material_check_icongreen.svg" alt="Check" /> : <img src="/assets/materialicons/material_close_iconred.svg" alt="Standard Not Met" />}
                        <span className="standard-name">WCAG AAA</span>
                        <span className="contrast-standard">4.5:1</span>
                    </div>
                    <h3>GUI Components</h3>
                    <div className={wcagContrast >= 3 ? "standard-met" : "standard-not-met"}>
                        {wcagContrast >= 3 ? <img src="/assets/materialicons/material_check_icongreen.svg" alt="Check" /> : <img src="/assets/materialicons/material_close_iconred.svg" alt="Standard Not Met" />}
                        <span className="standard-name">WCAG AA</span>
                        <span className="contrast-standard">3:1</span>
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
}
