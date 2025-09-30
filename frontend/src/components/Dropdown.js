import React, { useState } from "react";
import "../styles/Dropdown.css";

function Dropdown({ label, options, value, onSelect, disabled}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = (() => {
    if (!value) return label;
    const found = options.find((opt) =>
      typeof opt === "object" ? opt.value === value : opt === value
    );
    return found
      ? typeof found === "object"
        ? found.label
        : found
      : label;
  })();

  const handleSelect = (option) => {
    if (disabled) return;
    const val = typeof option === "object" ? option.value : option;
    onSelect(val);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown ${disabled ? "dropdown-disabled" : ""}`}>
      <button
        type="button"
        className="dropdown-toggle"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="dropdown-label">{selectedLabel}</span>
        {disabled ? (
          <img
            src="/icons/ChevronDownDisabled.svg"  // your disabled icon
            alt="Disabled"
          />
        ) : (
          <img
            src={isOpen ? "/icons/ChevronUp.svg" : "/icons/ChevronDown.svg"}
            alt={isOpen ? "Chevron Up" : "Chevron Down"}
          />
        )}
      </button>

      {isOpen && !disabled && (
        <ul className="dropdown-menu">
          {options.map((option, index) => {
            const val = typeof option === "object" ? option.value : option;
            const display = typeof option === "object" ? option.label : option;

            return (
              <li key={val || index} onClick={() => handleSelect(option)}>
                {display}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
