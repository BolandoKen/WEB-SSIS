import React, { useState, useEffect } from "react";
import "../styles/Table.css";
import IconButton from "./IconButton";
import DeletePopup from "./DeletePopup";
import TextPopup from "./TextPopup";

function DeptTable({ columns, rows, onRowClick, onSort, sortConfig, activePage, onDeleteSuccess, selectedrow, onEdit }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [textPopupMessage, setTextPopupMessage] = useState("");
  const [textPopupTitle, setTextPopupTitle] = useState("Oops!");

  const handleCloseDelete = () => {
    setSelectedRow(null);
    setShowDeletePopup(false);
  };

  const handleClosePopup = () => {
    setShowTextPopup(false);
  };

  const handleShowDelete = () => {
    setShowDeletePopup(true);
  };

  useEffect(() => {
    setSelectedRow(null);
  }, [rows]);

  const handleRowClick = (row, rowIndex) => {
    if (selectedRow === rowIndex) {
      setSelectedRow(null);
      if (onRowClick) onRowClick(null, null);
    } else {
      setSelectedRow(rowIndex);
      if (onRowClick) onRowClick(row, rowIndex);
    }
  };

  const handleDelete = async (row) => {
    if (!row) {
      console.error("Delete called without a row");
      return;
    }

    const id = row[0];
    let endpoint = "";

    switch (activePage) {
      case "colleges":
        endpoint = "/api/colleges";
        break;
      case "programs":
        endpoint = "/api/programs";
        break;
      case "students":
        endpoint = "/api/students";
        break;
      default:
        console.error("Unknown page:", activePage);
        return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:5000${endpoint}/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        onDeleteSuccess?.(id);
        setRowToDelete(null);
        setShowDeletePopup(false);
        setTextPopupTitle("Success");
        setTextPopupMessage("Record deleted successfully.");
        setShowTextPopup(true);

      } else {
        const error = await res.text();
        console.error(error);
        setTextPopupMessage("Failed to delete the record");
        setShowTextPopup(true);
      }
    } catch (err) {
      console.error(err);
      setTextPopupMessage("An error occurred while deleting. Please try again.");
      setShowTextPopup(true);
    }
  };

  return (
    <>
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="table-header-text"
                title="Click to sort"
                onClick={() => onSort(index)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>{col}</span>
                  {sortConfig?.key === index + 1 && (
                    <img
                      src={
                        sortConfig.direction === "asc"
                          ? "/icons/AscendingIcon.svg"
                          : "/icons/DescendingIcon.svg"
                      }
                      alt="sort arrow"
                      className="sort-arrow"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="table-items">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`table-row ${selectedRow === rowIndex ? "selected" : ""}`}
              onClick={() => handleRowClick(row, rowIndex)}
            >
              {row.slice(1, columns.length + 1).map((cell, cellIndex) => (
                <td key={cellIndex} className="table-cell">
                  {cell}
                </td>
              ))}

              {/* Edit & Delete button column */}
              <td className="table-cell-actions">
                <IconButton
                  icon="/icons/Edit.svg"
                  hoverIcon="/icons/EditHover.svg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(row);
                  }}
                />
                <IconButton
                  icon="/icons/Trash.svg"
                  hoverIcon="/icons/TrashHover.svg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRowToDelete(row);
                    handleShowDelete();
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeletePopup && (
        <DeletePopup
          onClose={handleCloseDelete}
          onDeleteConfirm={() => handleDelete(rowToDelete)}
          message="Are you sure you want to delete this record? This action cannot be undone."
          confirmText="Delete"
          title="Confirm Delete"
        />
      )}
      {showTextPopup && (
        <TextPopup
          message={textPopupMessage}
          onClose={() => setShowTextPopup(false)}
          title={textPopupTitle}
        />
      )}
    </>
  );
}

export default DeptTable;