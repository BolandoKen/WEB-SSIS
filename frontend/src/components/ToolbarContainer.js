import React, {useState} from "react";
import "../styles/ToolbarContainer.css";
import Toolbar from "./Toolbar";
import AddButton from "./AddButton";

function ToolbarContainer({ title }) {
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);

  const handleAddButtonClick = () => {
    setIsAddButtonClicked(true);
  };

  const handleReturnButtonClick = () => {
    setIsAddButtonClicked(false);
  };

  return (
    <div className="toolbar-container">
      <button onClick={handleReturnButtonClick}>Click Me</button>
      <Toolbar 
        title={title} 
        showIconButtons={!isAddButtonClicked} 
      />
      {!isAddButtonClicked && (
        <AddButton 
        href="#" 
        onClick={handleAddButtonClick} 
        />
      )}
    </div>
  );
}

export default ToolbarContainer;
