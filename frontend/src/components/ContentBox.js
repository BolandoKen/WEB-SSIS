import React, { useState } from "react";
import "../styles/ContentBox.css";
import ToolbarContainer from "./ToolbarContainer";
import Box from "./Box";

function ContentBox({ activePage }) {
  const title = activePage.charAt(0).toUpperCase() + activePage.slice(1);

  // new state: are we adding a new item?
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="content-box">
      <ToolbarContainer
        title={title}
        isAdding={isAdding}
        onAddClick={() => setIsAdding(true)}
        onReturnClick={() => setIsAdding(false)}
      />
      
      <Box 
        activePage={activePage}
        isAdding={isAdding}
        onCancel={() => setIsAdding(false)}
      />
    </div>
  );
}

export default ContentBox;
