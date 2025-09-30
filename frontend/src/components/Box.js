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
          const formatted = data.map((c) => [
            c.collegeCode, 
            c.collegeName
          ]);
          setRows(formatted);
        })
        .catch((err) => console.error("Error fetching colleges:", err));
    }
    else if (activePage === "programs") {
      fetch("http://127.0.0.1:5000/api/programs")
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((p) => [
            p.programCode, 
            p.programName, 
            p.collegeCode || "N/A"
          ]);
          setRows(formatted);
        })
        .catch((err) => console.error("Error fetching programs:", err));
    }
    else if (activePage === "students") {
      fetch("http://127.0.0.1:5000/api/students")
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((s) => [
            s.idNumber,
            s.firstname,
            s.lastname,
            s.gender,
            s.yearLevel,
            s.programCode || "N/A"
          ]);
          setRows(formatted);
        })
        .catch((err) => console.error("Error fetching students:", err));
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
                fetch("http://127.0.0.1:5000/api/colleges", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                })
                  .then((res) => res.json())
                  .then((result) => {
                    console.log("College created:", result);
                    // Refresh the colleges list
                    fetch("http://127.0.0.1:5000/api/colleges")
                      .then((res) => res.json())
                      .then((data) => {
                        const formatted = data.map((c) => [
                          c.collegeCode,
                          c.collegeName
                        ]);
                        setRows(formatted);
                      });
                    onCancel();
                  })
                  .catch((err) => console.error("Error creating college:", err));
              }}
              onToggle={onCancel}
            />
          )}

          {activePage === "programs" && (
            <ProgramForm
              onSubmit={(data) => {
                // Transform form data -> backend format
                const payload = {
                  programName: data.programName,
                  programCode: data.programCode,
                  college_id: data.college_id, // must be an integer id
                };

                console.log("Submitting payload:", payload);

                fetch("http://127.0.0.1:5000/api/programs", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                })
                  .then((res) => res.json())
                  .then((result) => {
                    console.log("Program created:", result);

                    // Refresh program list
                    fetch("http://127.0.0.1:5000/api/programs")
                      .then((res) => res.json())
                      .then((data) => {
                        const formatted = data.map((p) => [
                          p.programCode,
                          p.programName,
                          p.collegeCode,
                        ]);
                        setRows(formatted);
                      });

                    onCancel();
                  })
                  .catch((err) => console.error("Error creating program:", err));
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
            <Table
              columns={columns}
              rows={rows}
              onRowClick={(row, index) => {
                console.log("Row clicked:", row, "at index", index);
              }}
            />
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
