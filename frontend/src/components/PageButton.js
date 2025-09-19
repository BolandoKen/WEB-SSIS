import React, { useState } from "react";
import "../styles/PageButton.css";

function PageButton({ href = "#", icon, hoverIcon }) {
  const [currentIcon, setCurrentIcon] = useState(icon);

  return (
    <a
      href={href}
      className="page-button"
      onMouseEnter={() => hoverIcon && setCurrentIcon(hoverIcon)}
      onMouseLeave={() => setCurrentIcon(icon)}
    >
      {icon && <img src={currentIcon} alt="icon" className="btn-icon" />}
    </a>
  );
}

export default PageButton;
