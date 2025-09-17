import React from "react";
import "../styles/Button.css";  // import the CSS

function Button({ href = "#", label = "Button", icon = null }) {
  return (
    <a href={href} className="btn-component">
      {icon && (
        <img
          src={`/icons/${icon}`} // icons live in public/icons
          alt={`${label} icon`}
          className="btn-icon"
        />
      )}
      <span className="btn-label">{label}</span>
    </a>
  );
}

export default Button;
