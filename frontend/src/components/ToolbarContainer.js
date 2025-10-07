import React from "react";
import "../styles/ToolbarContainer.css";
import Toolbar from "./Toolbar";
import AddButton from "./AddButton";

function ToolbarContainer({ title, isAdding, onAddClick, onReturnClick, selectedRow , activePage, onDeleteSuccess, onEdit }) {
  return (
    <div className="toolbar-container">
      <Toolbar 
        title={title} 
        showIconButtons={!isAdding} 
        selectedRow={selectedRow}
        activePage={activePage}
        onDeleteSuccess={onDeleteSuccess}
        onEdit={onEdit}
      />
    
      {!isAdding && (
        <AddButton href="#" onClick={onAddClick} />
      )}
    </div>
  );
}

export default ToolbarContainer;
