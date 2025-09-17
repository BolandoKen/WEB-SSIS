import React from "react";
import "../styles/AddButton.css";

function AddButton({ href = "#" }) {
  return (
    <a href={href} className="add-button">
      <img src="/icons/plus.svg" alt="Add" className="btn-icon" />
    </a>
  );
}

export default AddButton;
