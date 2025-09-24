import React from "react";
import "../styles/Toolbar.css";
import IconButton from "./IconButton";

function Toolbar({ title, showIconButtons = true }) {
  return (
    <div className="toolbar">
      <p className="title">{title}</p>
      {showIconButtons && (
        <div className="toolbar-actions">
          <IconButton href="#" icon="/icons/Edit.svg" hoverIcon="/icons/EditHover.svg" />
          <IconButton href="#" icon="/icons/Trash.svg" hoverIcon="/icons/TrashHover.svg" />
        </div>
      )}
    </div>
  );
}
export default Toolbar;
