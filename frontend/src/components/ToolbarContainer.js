import React from "react";
import "../styles/ToolbarContainer.css";
import Toolbar from "./Toolbar";
import AddButton from "./AddButton";

function ToolbarContainer({ title }) {
  return (
    <div className="toolbar-container">
      <Toolbar title="Students" />
      <AddButton href="#" />
    </div>
  );
}

export default ToolbarContainer;
