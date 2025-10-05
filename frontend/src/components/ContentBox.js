import React, { useState } from "react";
import "../styles/ContentBox.css";
import ToolbarContainer from "./ToolbarContainer";
import Box from "./Box";

function ContentBox({ activePage }) {
  const title = activePage.charAt(0).toUpperCase() + activePage.slice(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);

  return (
    <div className="content-box">
      <ToolbarContainer
        title={title}
        isAdding={isAdding}
        onAddClick={() => setIsAdding(true)}
        onReturnClick={() => setIsAdding(false)}
        selectedRow={selectedRow}
        activePage={activePage}
        onDeleteSuccess={(id) => {
        setSelectedRow(null);
        setReloadFlag(prev => !prev);
        }}
      />
      <Box 
        activePage={activePage}
        isAdding={isAdding}
        onCancel={() => setIsAdding(false)}
        onRowSelect={setSelectedRow}
        reloadFlag={reloadFlag}
      />
    </div>
  );
}

export default ContentBox;
