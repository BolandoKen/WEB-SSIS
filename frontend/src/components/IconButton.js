import React, { useState } from "react";
import "../styles/IconButton.css";

function IconButton({ href = "#", icon, hoverIcon }) {
  const [currentIcon, setCurrentIcon] = useState(icon);

  return (
    <a
      href={href}
      className="icon-button"
      onMouseEnter={() => hoverIcon && setCurrentIcon(hoverIcon)}
      onMouseLeave={() => setCurrentIcon(icon)}
    >
      {icon && <img src={currentIcon} alt="icon" className="btn-icon" />}
    </a>
  );
}

export default IconButton;
