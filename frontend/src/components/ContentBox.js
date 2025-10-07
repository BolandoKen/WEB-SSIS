import React, { useState } from "react";
import "../styles/ContentBox.css";
import ToolbarContainer from "./ToolbarContainer";
import Box from "./Box";

function ContentBox({ activePage }) {
  const title = activePage.charAt(0).toUpperCase() + activePage.slice(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [editCollege, setEditCollege] = useState(null); // new state for editing

  const handleEdit = (rowData) => {
  if (!rowData) {
    console.warn("⚠️ No row selected to edit");
    return;
  }

  const [id, collegecode, collegename] = rowData;
  setEditCollege({ id, collegename, collegecode });
  setIsAdding(true);
};

  const handleReturn = () => {
  setIsAdding(false);
  setEditCollege(null); 
  setSelectedRow(null);  
};

const handleDeleteSuccess = (id) => {
  setSelectedRow(null);
  setReloadFlag((prev) => !prev);
};

  return (
    <div className="content-box">
      <ToolbarContainer
        title={title}
        isAdding={isAdding}
        onAddClick={() => {
          setEditCollege(null);
          setIsAdding(true);
        }}
        onReturnClick={handleReturn}
        selectedRow={selectedRow}
        activePage={activePage}
        onDeleteSuccess={handleDeleteSuccess}
        onEdit={handleEdit}
      />
      <Box 
        activePage={activePage}
        isAdding={isAdding}
        onCancel={() => handleReturn()}
        onRowSelect={setSelectedRow}
        reloadFlag={reloadFlag}
        selectedRow={selectedRow}
        editCollege={editCollege} 
        clearEdit={() => setEditCollege(null)}
      />
    </div>
  );
}

export default ContentBox;
