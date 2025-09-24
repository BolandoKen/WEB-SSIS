import React from "react";
import "../styles/AddButton.css";

function AddButton({ href = "#", onClick }) {
  const handleClick = (e) => {
    e.preventDefault(); // Prevents the page from navigating
    if (onClick) {
      onClick(); // Calls the function passed from parent
    }
  };

  return (
    <a href={href} className="add-button" onClick={handleClick}>
      <img src="/icons/plus.svg" alt="Add" className="btn-icon" />
    </a>
  );
}

export default AddButton;