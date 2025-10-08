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
  const [editProgram, setEditProgram] = useState(null);


  const handleEdit = (rowData) => {
  if (!rowData) {
    console.warn("⚠️ No row selected to edit");
    return;
  }
  if (activePage === "colleges") {
    const [id, collegecode, collegename] = rowData;
    setEditCollege({ id, collegename, collegecode });
  }
  else if (activePage === "programs") {
  const [id, programcode, programname, collegecode, collegename, college_id] = rowData;

  setEditProgram({
    id,
    programcode,
    programname,
    collegecode,
    collegename,
    college_id
  });
}

  setIsAdding(true);
};

  const handleReturn = () => {
  setIsAdding(false);
  setEditCollege(null);
  setEditProgram(null);
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
        editProgram={editProgram}
        clearEdit={() => {
          setEditCollege(null);
          setEditProgram(null);
        }}
      />
    </div>
  );
}

export default ContentBox;
