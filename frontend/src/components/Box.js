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

function Box({ activePage, isAdding, onCancel, onRowSelect, reloadFlag, selectedRow, editCollege, editProgram, clearEdit }) {
  const [rows, setRows] = useState([]);
  let columns = [];
  let dropdownOptions = [];

  const loadcolleges = () => {
    fetch("http://127.0.0.1:5000/api/colleges")
    .then((res) => res.json())
    .then((data) => {
      const formatted = data.map((c) => [
            c.id,
            c.collegeCode, 
            c.collegeName
      ]);
      setRows(formatted);
    })
    .catch((err) => console.error("Error fetching colleges:", err));
  };

  const loadPrograms = () => {
  fetch("http://127.0.0.1:5000/api/programs")
    .then((res) => res.json())
    .then((data) => {
      const formatted = data.map((p) => [
        p.id,            
        p.programcode,   
        p.programname,   
        p.collegecode,   
        p.collegename,   
        p.college_id     
      ]);
      setRows(formatted);
    })
    .catch((err) => console.error("Error fetching programs:", err));
  };


  const loadStudents = () => {
    fetch("http://127.0.0.1:5000/api/students")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((s) => [
          s.id,
          s.idnumber,
          s.firstname,
          s.lastname,
          s.gender,
          s.yearlevel,
          s.programcode || "N/A"
        ]);
        setRows(formatted);
      })
      .catch((err) => console.error("Error fetching students:", err));
  };


  useEffect(() => {
    if (activePage === "colleges") {
      loadcolleges();
    }
    else if (activePage === "programs") {
      loadPrograms();
    }
    else if (activePage === "students") {
      loadStudents();
    }
  }, [activePage, reloadFlag]);

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
              selectedCollege={editCollege} 
              onSubmit={(data) => {
                const isEditing = !!editCollege; 
                const endpoint = isEditing
                  ? `http://127.0.0.1:5000/api/colleges?id=${editCollege.id}`
                  : "http://127.0.0.1:5000/api/colleges";

                const method = isEditing ? "PUT" : "POST"

                fetch(endpoint, {
                  method,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                })
                  .then((res) => res.json())
                  .then((result) => {
                    console.log(isEditing ? "College updated:" : "College created:", result);
                    loadcolleges();
                    onCancel();
                    clearEdit?.();

                    if (onRowSelect) onRowSelect(null);
                  })
                  .catch((err) =>
                    console.error(isEditing ? "Error updating college:" : "Error creating college:", err)
                  );
              }}
              onToggle={onCancel}
            />
          )}
          {activePage === "programs" && (
            <ProgramForm
              isEditing={!!editProgram}
              selectedProgram={editProgram}
              onSubmit={(data) => {
                const isEditing = !!editProgram;
                const endpoint = isEditing
                  ? `http://127.0.0.1:5000/api/programs?id=${editProgram.id}`
                  : "http://127.0.0.1:5000/api/programs";

                const method = isEditing ? "PUT" : "POST";

                fetch(endpoint, {
                  method,
                  headers: {"Content-Type": "application/json",},
                  body: JSON.stringify(data),
                })
                  .then((res) => res.json())
                  .then((result) => {
                    console.log(isEditing ? "Program updated:" : "Program created:", result);
                    loadPrograms();
                    onCancel();
                    clearEdit?.();

                    if (onRowSelect) onRowSelect(null);
                  })
                  .catch((err) => 
                    console.error(isEditing ? "Error updating program:" : "Error creating program:", err));
              }}
              onToggle={onCancel}
            />
          )}

          {activePage === "students" && (
            <StudentForm
              onSubmit={(data) => {
                const payload = {
                  idNumber: data.idNumber,
                  firstname: data.firstname,   
                  lastname: data.lastname,    
                  gender: data.gender,
                  yearLevel: data.yearLevel,
                  program_id: data.program_id,
                };
                console.log("Submitting student payload:", JSON.stringify(payload, null, 2));


                fetch("http://127.0.0.1:5000/api/students", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                })
                  .then((res) => res.json())
                  .then((result) => {
                    console.log("Student created:", result);
                    loadStudents();
                    onCancel();
                  })
                  .catch((err) => console.error("Error creating student:", err));
              }}
              onToggle={onCancel}
            />
          )}
        </>
      ) : (
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
              selectedRow={selectedRow}
              onRowClick={(row, index) => {
                onRowSelect(row);
              }}
            />
          </div>

          <div className="box-button-section">
            {selectedRow && (
              <div style={{ marginTop: "10px", color: "#aaa" }}>
                <strong>Selected Row:</strong> {JSON.stringify(selectedRow)}
              </div>
            )}
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
