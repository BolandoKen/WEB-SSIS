import React from "react";
import "../styles/ContentBox.css";
import ToolbarContainer from "./ToolbarContainer";
import Box from "./Box";

function ContentBox({ activePage }) {
  const title = activePage.charAt(0).toUpperCase() + activePage.slice(1);

  return (
    <div className="content-box">
      <ToolbarContainer title={title} />
      <Box activePage={activePage} />
    </div>
  );
}

export default ContentBox;