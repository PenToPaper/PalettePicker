import React, { useEffect, useRef } from "react";
import Swatch from "./Swatch";

export default function SwatchSection(props) {
    const inputContainer = useRef(null);

    const adjustInputWidth = () => {
        const newHeight = inputContainer.current.clientHeight;
        if (window.innerWidth > 1280) {
            inputContainer.current.childNodes[0].style.width = newHeight + "px";
        } else {
            inputContainer.current.childNodes[0].removeAttribute("style");
        }
    };

    useEffect(() => {
        window.addEventListener("resize", adjustInputWidth);

        return () => {
            window.removeEventListener("resize", adjustInputWidth);
        };
    }, [inputContainer, adjustInputWidth]);

    useEffect(() => {
        adjustInputWidth();
    }, [Object.keys(props.swatches).length]);

    return (
        <section id={props.sectionName}>
            <button aria-label="Add Swatch to Section" className="add-swatch" onClick={props.onAddSwatch} />
            <div className="swatch-section-header" ref={inputContainer}>
                <input
                    value={props.sectionName}
                    onChange={(e) => {
                        props.onSectionNameChange(props.sectionName, e.target.value);
                    }}
                />
            </div>
            <div className="section-swatches">
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
            </div>
            <button
                aria-label="Delete Swatch Section"
                onClick={(event) => {
                    event.stopPropagation();
                    props.onDeleteSwatchSection(props.sectionName);
                }}
                className="delete-section"
            />
        </section>
    );
}
