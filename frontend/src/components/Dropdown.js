import React, { useState } from "react";
import "../styles/Dropdown.css";

function Dropdown({ label, options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label); // default placeholder text

  const handleSelect = (option) => {
    setSelected(option);   // update placeholder to selected option
    onSelect(option);      // send value to parent
    setIsOpen(false);      // close dropdown
  };

  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}{" "}
        <img
          src={isOpen ? "/icons/ChevronUp.svg" : "/icons/ChevronDown.svg"}
          alt={isOpen ? "Chevron Up" : "Chevron Down"}
        />
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li key={option} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
