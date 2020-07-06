import React from "react";

export default function AddSwatch(props) {
    return (
        <section className="add-section-container">
            <button className="add-section" onClick={props.onClick}>
                <img src="/assets/materialicons/material_create_folder_offwhite.svg" alt="" />
                Add New Section
            </button>
        </section>
    );
}
