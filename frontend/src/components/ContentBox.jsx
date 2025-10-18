import React, { useState, useEffect } from "react";
import "../styles/ContentBox.css";
import ToolbarContainer from "./ToolbarContainer";
import Box from "./Box";

function ContentBox({ activePage }) {
  const title = activePage.charAt(0).toUpperCase() + activePage.slice(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [editCollege, setEditCollege] = useState(null); 
  const [editProgram, setEditProgram] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  const handleEdit = (rowData) => {
    if (!rowData) {
      console.warn("⚠️ No row selected to edit");
      return;
    }
    if (activePage === "colleges") {
      const [id, collegecode, collegename] = rowData;
      setEditCollege({ id, collegename, collegecode });
    } else if (activePage === "programs") {
      const [id, programcode, programname, collegecode, collegename, college_id] = rowData;
      setEditProgram({
        id,
        programcode,
        programname,
        collegecode,
        collegename,
        college_id
      });
    } else if (activePage === "students") {
      const [id, idnumber, firstname, lastname, gender, yearlevel, programcode, programname, collegecode, collegename, program_id, college_id, profile_photo_url] = rowData;
      setEditStudent({
        id,
        idnumber,
        firstname,
        lastname,
        gender,
        yearlevel,
        programcode,
        programname,
        collegecode,
        collegename,
        program_id,
        college_id,
        profile_photo_url  // ← This was missing!
      });
    }
    setIsAdding(true);
  };

  const handleReturn = () => {
  setIsAdding(false);
  setEditCollege(null);
  setEditProgram(null);
  setEditStudent(null);
  setSelectedRow(null);
  };

  const handleDeleteSuccess = (id) => {
  setSelectedRow(null);
  setReloadFlag((prev) => !prev);
  };

  useEffect(() => {
    setIsAdding(false);
    setEditCollege(null);
    setEditProgram(null);
    setEditStudent(null);
    setSelectedRow(null);
  }, [activePage]);

  return (
    <div className="content-box">
      <ToolbarContainer
        title={title}
        isAdding={isAdding}
        onAddClick={() => {
          setEditCollege(null);
          setIsAdding(true);
        }}
        onReturnClick={handleReturn}
        selectedRow={selectedRow}
        activePage={activePage}
        onDeleteSuccess={handleDeleteSuccess}
        onEdit={handleEdit}
      />
      <Box 
        activePage={activePage}
        isAdding={isAdding}
        onCancel={() => handleReturn()}
        onRowSelect={setSelectedRow}
        reloadFlag={reloadFlag}
        selectedRow={selectedRow}
        editCollege={editCollege} 
        editProgram={editProgram}
        editStudent={editStudent}
        clearEdit={() => {
          setEditCollege(null);
          setEditProgram(null);
          setEditStudent(null);
        }}
      />
    </div>
  );
}

export default ContentBox;
