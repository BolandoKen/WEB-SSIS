import React from "react";
import "../styles/Button.css";

function Button({ label, icon, hoverIcon, activeIcon, onClick, isActive, className }) {
  const [currentIcon, setCurrentIcon] = React.useState(icon);
  return (
    <button 
      className={`btn-component ${isActive ? "active" : "" } ${className ?? ""}`} 
      onClick={onClick}
      onMouseEnter={() => setCurrentIcon(hoverIcon)}
      onMouseLeave={() => setCurrentIcon(icon)}
    >
      {icon && (
        <img
          src={`/icons/${isActive && activeIcon ? activeIcon : currentIcon}`}
          alt={`${label} icon`}
          className="btn-icon"
        />
      )}
      <span className="btn-label">{label}</span>
    </button>
  );
}

export default Button;
