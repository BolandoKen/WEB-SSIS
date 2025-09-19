import React from "react";
import Searchbar from "./Searchbar";
import Table from "./Table";
import Dropdown from "./Dropdown";
import OrderButton from "./OrderButton";
import PageButton from "./PageButton";
import "../styles/Box.css";

function Box({ activePage }) {
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
      <div className="box-tool-section">
        <Searchbar />
        <p className="sort-text">Sort by:</p>
        
        <Dropdown
          label="All"
          options={dropdownOptions}
          onSelect={handleSelect}
        />

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
    </div>
  );
}

export default Box;
