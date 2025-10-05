import React, { useState } from "react";
import "../styles/IconButton.css";

function IconButton({icon, hoverIcon, onClick}) {
  const [currentIcon, setCurrentIcon] = useState(icon);

  return (
    <button
      type="button"
      className="icon-button"
      onClick={onClick}
      onMouseEnter={() => hoverIcon && setCurrentIcon(hoverIcon)}
      onMouseLeave={() => setCurrentIcon(icon)}
    >
      {icon && <img src={currentIcon} alt="icon" className="btn-icon" />}
    </button>
  );
}

export default IconButton;
