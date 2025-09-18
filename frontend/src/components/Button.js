import React from "react";
import "../styles/Button.css";

function Button({ label, icon, activeIcon, onClick, isActive }) {
  return (
    <button className={`btn-component ${isActive ? "active" : ""}`} onClick={onClick}>
      {icon && (
        <img
          src={`/icons/${isActive && activeIcon ? activeIcon : icon}`}
          alt={`${label} icon`}
          className="btn-icon"
        />
      )}
      <span className="btn-label">{label}</span>
    </button>
  );
}

export default Button;
