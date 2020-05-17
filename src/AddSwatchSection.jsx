import React from "react";

export default function AddSwatch(props) {
    return (
        <section>
            <button className="add-section" onClick={props.onClick}>
                <img src="/assets/materialicons/material_add_light.svg" alt="" />
                Add New Section
            </button>
        </section>
    );
}
