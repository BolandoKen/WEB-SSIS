import React from "react";
import Searchbar from "./Searchbar";
import Table from "./Table";
import Dropdown from "./Dropdown";
import OrderButton from "./OrderButton";
import PageButton from "./PageButton";
import CollegeForm from "./CollegeForm";
import ProgramForm from "./ProgramForm";
import "../styles/Box.css";

function Box({ activePage, isAdding, onCancel }) {
  let columns = [];
  let rows = [];
  let dropdownOptions = [];

  switch (activePage) {
    case "students":
      columns = ["ID Number", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      rows = [["2023-1864", "Kilmer Douglas Bernardo", "Bolando", "Male", "3", "BSCS"]];
      dropdownOptions = ["All", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      break;

    case "programs":
      columns = ["Code", "Name", "College"];
      rows = [["BSCS", "Bachelor of Science in Computer Science", "CSS"]];
      dropdownOptions = ["All", "Code", "Name", "College"];
      break;

    case "colleges":
      columns = ["Code", "Name"];
      rows = [["CCS", "College of Computer Studies"]];
      dropdownOptions = ["All", "Code", "Name"];
      break;

    default:
      columns = ["ID Number", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      rows = [];
      dropdownOptions = ["All"];
  }

  const handleSelect = (option) => {
    console.log("Selected:", option);
    // TODO: apply filtering based on option
  };
return (
    <div className="box">
      {isAdding ? (
        // 🔑 Show form instead of table
        <>
          {activePage === "colleges" && (
            <CollegeForm
              onSubmit={(data) => {
                console.log("New college added:", data);
                onCancel();
              }}
              onToggle={onCancel}
            />
          )}

          {activePage === "programs" && (
            <ProgramForm
              onSubmit={(data) => {
                console.log("New program added:", data);
                onCancel();
              }}
              onToggle={onCancel}
            />
          )}

          {activePage === "students" && (
            <div className="form-placeholder">
              <p>Student Form goes here</p>
              <button onClick={onCancel}>Cancel</button>
            </div>
          )}
        </>
      ) : (
        // 🔑 Normal table view
        <>
          <div className="box-tool-section">
            <Searchbar />
            <p className="sort-text">Sort by:</p>

            <div className="dropdown-container">  
              <Dropdown
              label="All"
              options={dropdownOptions}
              onSelect={handleSelect}
            />
            </div>
            
            <OrderButton
              upIcon="/icons/ArrowUp.svg"
              upHover="/icons/ArrowUpHover.svg"
              downIcon="/icons/ArrowDown.svg"
              downHover="/icons/ArrowDownHover.svg"
              onClick={(isUp) =>
                console.log("Sorting:", isUp ? "Ascending" : "Descending")
              }
            />
          </div>

          <div className="box-table-section">
            <Table columns={columns} rows={rows} />
          </div>

          <div className="box-button-section">
            <PageButton
              href="#"
              icon="/icons/ChevronLeft.svg"
              hoverIcon="/icons/ChevronLeftHover.svg"
            />
            <PageButton
              href="#"
              icon="/icons/ChevronRight.svg"
              hoverIcon="/icons/ChevronRightHover.svg"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Box;
