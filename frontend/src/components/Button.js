import React from "react";
import "../styles/Button.css";

function Button({ label = "Button", icon = null, onClick }) {
  return (
    <button className="btn-component" onClick={onClick}>
      {icon && (
        <img
          src={`/icons/${icon}`}
          alt={`${label} icon`}
          className="btn-icon"
        />
      )}
      <span className="btn-label">{label}</span>
    </button>
  );
}

export default Button;
