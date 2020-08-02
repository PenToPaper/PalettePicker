import React, { useRef, useEffect, useState } from "react";
import Swatch from "./Swatch";
import { getWCAGContrast } from "./ColorUtils.js";
import FocusTrap from "focus-trap-react";

export function ContrastType(props) {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    /*
        [
            {
                type: standard
                standardMet: boolean,
                standardRatio: 4.5,
                standardName: "WCAG AA",
            },
            {
                type: text
            },
            {
                type: graphic
            }
        ]
    */
    const cssFormattedTypeName = props.typeName.replace(" ", "-").toLowerCase();
    return (
        <div className={`contrast-checker-${cssFormattedTypeName}`}>
            <h4>{props.typeName}</h4>
            <button
                aria-describedby={`#tooltip-${cssFormattedTypeName}`}
                onMouseUp={(event) => {
                    event.preventDefault();
                    setIsTooltipOpen((prevTooltipState) => !prevTooltipState);
                }}
                onMouseDown={(event) => {
                    event.preventDefault();
                }}
            >
                <img src="assets/materialicons/material_help_outline_offwhite.svg" alt={`Show definition of ${props.typeName.toLowerCase()}`} />
            </button>
            <div className={isTooltipOpen ? "contrast-checker-tooltip tooltip-open" : "contrast-checker-tooltip"} role="tooltip" id={`#tooltip-${cssFormattedTypeName}`} aria-hidden={!isTooltipOpen}>
                {props.tooltip}
            </div>
            {props.standards.map((standard, index) => {
                switch (standard.type) {
                    case "standard":
                        return (
                            <div key={index} className={standard.standardMet ? "standard-met" : "standard-not-met"}>
                                <div className="standard-compliance-box">
                                    {standard.standardMet ? <img src="assets/materialicons/material_check_lightgreen.svg" alt="Check" /> : <img src="assets/materialicons/material_close_lightred.svg" alt="Standard Not Met" />}
                                </div>
                                <span className="standard-name">{standard.standardName}</span>
                                <span className="contrast-standard">{standard.standardRatio}:1</span>
                            </div>
                        );
                    case "text":
                        return (
                            <div key={index} className={`sample-${cssFormattedTypeName}`} style={{ backgroundColor: props.foreground.hex }}>
                                <span>{standard.label}</span>
                                <span style={{ color: props.background.hex }}>The quick brown fox jumps over the lazy dog.</span>
                            </div>
                        );
                    case "graphic":
                        return (
                            <div key={index} className={`sample-${cssFormattedTypeName}`} style={{ backgroundColor: props.foreground.hex }}>
                                <span>{standard.label}</span>
                                <div className="shapes">
                                    <div style={{ borderBottomColor: props.background.hex }} className="shape-1"></div>
                                    <div style={{ backgroundColor: props.background.hex }} className="shape-2"></div>
                                    <div style={{ backgroundColor: props.background.hex }} className="shape-3"></div>
                                </div>
                            </div>
                        );
                }
            })}
        </div>
    );
}

export function AccordianSwatches(props) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    const handleButtonKeyDown = (event) => {
        switch (event.keyCode) {
            // Space
            case 32:
                toggle();
                break;
        }
    };

    return (
        <div className="contrast-checker-row">
            <button className={isOpen ? "phone-accordian-swatches accordian-open" : "phone-accordian-swatches"} onClick={toggle} onKeyDown={handleButtonKeyDown} aria-expanded={isOpen} aria-controls="contrast-checker-accordian-swatches">
                <h4 id="contrast-checker-accordian-label">Swatches</h4>
            </button>
            <div className={isOpen ? "contrast-checker-swatches" : "contrast-checker-swatches contrast-checker-swatches-hidden"} id="contrast-checker-accordian-swatches" aria-labelledby="contrast-checker-accordian-label" aria-hidden={!isOpen}>
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
        </div>
    );
}

export default function ContrastCheck(props) {
    const exit = useRef(null);
    const [windowWidth, setWindowWidth] = useState(null);

    useEffect(() => {
        exit.current.focus();
    }, []);

    const determineMobileLayout = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        determineMobileLayout();
        window.addEventListener("resize", determineMobileLayout);

        return () => {
            window.removeEventListener("resize", determineMobileLayout);
        };
    }, [determineMobileLayout]);

    const handleButtonKeyDown = (event) => {
        switch (event.keyCode) {
            // Escape
            case 27:
                props.onModalClose();
                break;
        }
    };

    const getLayoutByScreenSize = (screenSize) => {
        if (screenSize > 1280) {
            return (
                <div className="contrast-checker modal" role="dialog" aria-label="Contrast Checker" aria-modal="true" onKeyDown={handleButtonKeyDown}>
                    <button className="modal-exit" aria-label="Exit Contrast Checker" ref={exit} onClick={props.onModalClose}></button>
                    <div className="contrast-checker-row">
                        <div className="contrast-checker-rating">
                            <h3>WCAG Contrast</h3>
                            <h2>{`${Math.round(1000 * wcagContrast) / 1000}:1`}</h2>
                        </div>
                        <div className="contrast-checker-swatches">
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
                    </div>
                    <div className="contrast-checker-row">
                        <ContrastType
                            typeName="Normal Text"
                            tooltip="Normal text is under 18pt, or under 16pt and bold."
                            standards={[
                                { type: "standard", standardMet: wcagContrast >= 4.5, standardRatio: 4.5, standardName: "WCAG AA" },
                                { type: "standard", standardMet: wcagContrast >= 7, standardRatio: 7, standardName: "WCAG AAA" },
                                { type: "text", label: "12pt" },
                            ]}
                            foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                            background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                        />
                        <ContrastType
                            typeName="Large Text"
                            tooltip="Large text is at least 18pt, or 16pt and bold."
                            standards={[
                                { type: "standard", standardMet: wcagContrast >= 3, standardRatio: 3, standardName: "WCAG AA" },
                                { type: "standard", standardMet: wcagContrast >= 4.5, standardRatio: 4.5, standardName: "WCAG AAA" },
                                { type: "text", label: "18pt" },
                            ]}
                            foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                            background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                        />
                        <ContrastType
                            tooltip="A GUI component contains visual information required to identify UI components and states."
                            typeName="GUI Components"
                            standards={[
                                { type: "standard", standardMet: wcagContrast >= 3, standardRatio: 3, standardName: "WCAG AA" },
                                { type: "graphic", label: "GUI" },
                            ]}
                            foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                            background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                        />
                    </div>
                </div>
            );
        } else if (screenSize > 800) {
            return (
                <div className="contrast-checker modal" role="dialog" aria-label="Contrast Checker" aria-modal="true" onKeyDown={handleButtonKeyDown}>
                    <button className="modal-exit" aria-label="Exit Contrast Checker" ref={exit} onClick={props.onModalClose}></button>
                    <div className="contrast-checker-row">
                        <div className="contrast-checker-swatches">
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
                    </div>
                    <div className="contrast-checker-grid">
                        <div className="contrast-checker-column">
                            <div className="contrast-checker-rating">
                                <h3>WCAG Contrast</h3>
                                <h2>{`${Math.round(1000 * wcagContrast) / 1000}:1`}</h2>
                            </div>
                            <ContrastType
                                typeName="Large Text"
                                tooltip="Large text is at least 18pt, or 16pt and bold."
                                standards={[
                                    { type: "standard", standardMet: wcagContrast >= 3, standardRatio: 3, standardName: "WCAG AA" },
                                    { type: "standard", standardMet: wcagContrast >= 4.5, standardRatio: 4.5, standardName: "WCAG AAA" },
                                    { type: "text", label: "18pt" },
                                ]}
                                foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                                background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                            />
                        </div>
                        <div className="contrast-checker-column">
                            <ContrastType
                                typeName="Normal Text"
                                tooltip="Normal text is under 18pt, or under 16pt and bold."
                                standards={[
                                    { type: "standard", standardMet: wcagContrast >= 4.5, standardRatio: 4.5, standardName: "WCAG AA" },
                                    { type: "standard", standardMet: wcagContrast >= 7, standardRatio: 7, standardName: "WCAG AAA" },
                                    { type: "text", label: "12pt" },
                                ]}
                                foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                                background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                            />
                            <ContrastType
                                tooltip="A GUI component is visual information required to identify UI components and states."
                                typeName="GUI Components"
                                standards={[
                                    { type: "standard", standardMet: wcagContrast >= 3, standardRatio: 3, standardName: "WCAG AA" },
                                    { type: "graphic", label: "GUI" },
                                ]}
                                foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                                background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="contrast-checker modal" role="dialog" aria-label="Contrast Checker" aria-modal="true" onKeyDown={handleButtonKeyDown}>
                    <button className="modal-exit" aria-label="Exit Contrast Checker" ref={exit} onClick={props.onModalClose}></button>
                    <AccordianSwatches onChange={props.onChange} colorMode={props.colorMode} swatches={props.swatches} selection={props.selection} />
                    <div className="contrast-checker-grid">
                        <div className="contrast-checker-column">
                            <div className="contrast-checker-rating">
                                <h3>WCAG Contrast</h3>
                                <h2>{`${Math.round(1000 * wcagContrast) / 1000}:1`}</h2>
                            </div>
                            <ContrastType
                                typeName="Large Text"
                                tooltip="Large text is at least 18pt, or 16pt and bold."
                                standards={[
                                    { type: "standard", standardMet: wcagContrast >= 3, standardRatio: 3, standardName: "WCAG AA" },
                                    { type: "standard", standardMet: wcagContrast >= 4.5, standardRatio: 4.5, standardName: "WCAG AAA" },
                                    { type: "text", label: "18pt" },
                                ]}
                                foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                                background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                            />
                        </div>
                        <div className="contrast-checker-column">
                            <ContrastType
                                typeName="Normal Text"
                                tooltip="Normal text is under 18pt, or under 16pt and bold."
                                standards={[
                                    { type: "standard", standardMet: wcagContrast >= 4.5, standardRatio: 4.5, standardName: "WCAG AA" },
                                    { type: "standard", standardMet: wcagContrast >= 7, standardRatio: 7, standardName: "WCAG AAA" },
                                    { type: "text", label: "12pt" },
                                ]}
                                foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                                background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                            />
                            <ContrastType
                                tooltip="A GUI component is visual information required to identify UI components and states."
                                typeName="GUI Components"
                                standards={[
                                    { type: "standard", standardMet: wcagContrast >= 3, standardRatio: 3, standardName: "WCAG AA" },
                                    { type: "graphic", label: "GUI" },
                                ]}
                                foreground={props.swatches[props.selection[0].sectionName][props.selection[0].index]}
                                background={props.swatches[props.selection[1].sectionName][props.selection[1].index]}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    };

    const wcagContrast = getWCAGContrast(props.swatches[props.selection[0].sectionName][props.selection[0].index], props.swatches[props.selection[1].sectionName][props.selection[1].index], props.colorMode);

    return <FocusTrap>{getLayoutByScreenSize(windowWidth)}</FocusTrap>;
}
