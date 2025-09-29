import React, { useState, useEffect } from "react";
import Searchbar from "./Searchbar";
import Table from "./Table";
import Dropdown from "./Dropdown";
import OrderButton from "./OrderButton";
import PageButton from "./PageButton";
import CollegeForm from "./CollegeForm";
import ProgramForm from "./ProgramForm";
import StudentForm from "./StudentForm";
import "../styles/Box.css";

function Box({ activePage, isAdding, onCancel }) {
  const [rows, setRows] = useState([]);
  let columns = [];
  let dropdownOptions = [];

  useEffect(() => {
    if (activePage === "colleges") {
      fetch("http://127.0.0.1:5000/api/colleges")
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((c) => [c.collegeCode, c.collegeName]);
          setRows(formatted);
        })
        .catch((err) => console.error("Error fetching colleges:", err));
    }
  }, [activePage]);

  switch (activePage) {
    case "students":
      columns = ["ID Number", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      dropdownOptions = ["All", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      break;

    case "programs":
      columns = ["Code", "Name", "College"];
      dropdownOptions = ["All", "Code", "Name", "College"];
      break;

    case "colleges":
      columns = ["Code", "Name"];
      dropdownOptions = ["All", "Code", "Name"];
      break;

    default:
      columns = [];
      dropdownOptions = ["All"];
  }

  const handleSelect = (option) => {
    console.log("Selected:", option);
  };
return (
    <div className="box">
      {isAdding ? (

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
            <StudentForm
              onSubmit={(data) => {
                console.log("New student added:", data);
                onCancel();
              }}
              onToggle={onCancel}
            />
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
