import React, { useState } from "react";
import "../styles/PageButton.css";

function PageButton({ href = "#", icon, hoverIcon, onClick, disabled = false }) {
  const [currentIcon, setCurrentIcon] = useState(icon);

  return (
    <a
      href={href}
      className={`page-button ${disabled ? "disabled" : ""}`}
      onClick={(e) => {
        e.preventDefault(); 
        if (!disabled && onClick) onClick(); 
      }}
      onMouseEnter={() => hoverIcon && setCurrentIcon(hoverIcon)}
      onMouseLeave={() => setCurrentIcon(icon)}
    >
      {icon && <img src={currentIcon} alt="icon" className="btn-icon" />}
    </a>
  );
}

export default PageButton;
