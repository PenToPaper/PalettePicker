import React from "react";

export default function AddSwatch(props) {
    return <button className="add-swatch" aria-label="Add Swatch" onClick={props.onAddSwatch}></button>;
}
