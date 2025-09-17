import React from "react";
import "../styles/ContentBox.css";
import ToolbarContainer from "./ToolbarContainer";
import Box from "./Box";

function ContentBox(){
    return (
       <div className="content-box">
            <ToolbarContainer />
            <Box />
       </div>
    )
}

export default ContentBox;