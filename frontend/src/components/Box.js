import React, { useState, useEffect } from "react";
import Searchbar from "./Searchbar";
import Table from "./Table";
import PageButton from "./PageButton";
import CollegeForm from "./CollegeForm";
import ProgramForm from "./ProgramForm";
import StudentForm from "./StudentForm";
import "../styles/Box.css";

function Box({ activePage, isAdding, onCancel, onRowSelect, reloadFlag, selectedRow, editCollege, editProgram, editStudent, clearEdit }) {
  const [rows, setRows] = useState([]);
  let columns = [];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (columnIndex) => {
  const realIndex = columnIndex + 1; // skip id column

  let direction = "asc";
  if (sortConfig.key === realIndex && sortConfig.direction === "asc") {
    direction = "desc";
  }

  setSortConfig({ key: realIndex, direction });
};

  const filteredRows = rows.filter((row) =>
    row.some((cell) =>
      cell?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedRows = React.useMemo(() => {
    const filtered = rows.filter((row) =>
      row.some((cell) =>
        cell?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key === null) return filtered;

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key]?.toString().toLowerCase();
      const bValue = b[sortConfig.key]?.toString().toLowerCase();

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [rows, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = sortedRows.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
        p.collegecode || "N/A",   
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
          s.programcode || "N/A",
          s.programname,
          s.collegecode,
          s.collegename,
          s.program_id,
          s.college_id
        ]);
        setRows(formatted);
      })
      .catch((err) => console.error("Error fetching students:", err));
  };

  useEffect(() => {
  if (isAdding) {
    setSearchTerm(""); // clear search when entering add/edit mode
  }
  }, [isAdding]);

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
      break;

    case "programs":
      columns = ["Code", "Name", "College"];
      break;

    case "colleges":
      columns = ["Code", "Name"];
      break;

    default:
      columns = [];
  }

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
              isEditing={!!editStudent}
              selectedStudent={editStudent}
              onSubmit={(data) => {
                const isEditing = !!editStudent;
                const endpoint = isEditing
                  ? `http://127.0.0.1:5000/api/students?id=${editStudent.id}`
                  : "http://127.0.0.1:5000/api/students";

                  const method = isEditing ? "PUT" : "POST";

                fetch(endpoint, {
                  method,
                  headers: {"Content-Type": "application/json",},
                  body: JSON.stringify(data),
                })
                  .then((res) => res.json())
                  .then((result) => {
                    console.log(isEditing ? "Student updated:" : "Student created:", result);
                    loadStudents();
                    onCancel();
                    clearEdit?.();

                    if (onRowSelect) onRowSelect(null);
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
            <Searchbar 
              onSearch={setSearchTerm}
              query={searchTerm}
            />
          </div>

          <div className="box-table-section">
            <Table
              columns={columns}
              rows={currentRows}
              selectedRow={selectedRow}
              onSort={handleSort}        // Pass your sort handler
              sortConfig={sortConfig} 
              onRowClick={(row, index) => {
                onRowSelect(row);
              }}
            />
          </div>

          <div className="box-button-section">
            <PageButton
              className="previous-button"
              href="#"
              icon="/icons/ChevronLeft.svg"
              hoverIcon="/icons/ChevronLeftHover.svg"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            />

            <span className="page-counter">
              {currentPage} of {totalPages}
            </span>

            <PageButton
              className="next-button"
              href="#"
              icon="/icons/ChevronRight.svg"
              hoverIcon="/icons/ChevronRightHover.svg"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Box;
