import React, { useState } from "react";

export default function Nav(props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav role="navigation" className={isOpen ? "hamburger-menu-expanded" : ""}>
            <img src="/assets/PalettePickerLogo.svg" alt="Palette Picker Logo" />
            <button className="hamburger-menu-container" aria-label="Toggle the Project Menu" aria-expanded={isOpen ? "true" : "false"} aria-controls="hamburger-menu-body" onClick={() => setIsOpen(!isOpen)}>
                <img src="/assets/materialicons/material_menu_offwhite.svg" alt="" />
            </button>
            <div id="hamburger-menu-body" aria-label="Your Projects" hidden={!isOpen}>
                <ul>
                    <li className="project-selected" aria-selected="true">
                        <button>Dougie Jam Productions 2019</button>
                    </li>
                    <li aria-selected="false">
                        <button>Personal Portfolio 2019</button>
                    </li>
                </ul>
                <button className="add-project">
                    <img src="/assets/materialicons/material_add_offwhite.svg" alt="" />
                    Add Project
                </button>
            </div>
        </nav>
    );
}
