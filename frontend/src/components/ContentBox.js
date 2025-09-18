import React from "react";
import "../styles/ContentBox.css";
import ToolbarContainer from "./ToolbarContainer";
import Box from "./Box";

function ContentBox({activePage}){
    return (
       <div className="content-box">
            <ToolbarContainer />
            <Box activePage = {activePage} />
       </div>
    )
}

export default ContentBox;