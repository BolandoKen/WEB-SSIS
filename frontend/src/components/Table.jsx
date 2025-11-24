import React, { useState, useEffect } from "react";
import "../styles/Table.css";

function Table({ columns, rows, onRowClick, onSort, sortConfig, activePage}) {
  const [selectedRow, setSelectedRow] = useState(null);

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

  return (
    <table className="table">
      <thead className="table-header">
        <tr>
          {columns.map((col, index) =>
            index === 0 ? null : (
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
            )
          )}
        </tr>
      </thead>

      <tbody className="table-items">
        {rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={`table-row ${selectedRow === rowIndex ? "selected" : ""}`}
            onClick={() => handleRowClick(row, rowIndex)}
          >
            {row.slice(0, columns.length).map((cell, cellIndex) => {
              if (cellIndex === 0) return null;

              // Hide image column when not on students page
              if (cellIndex === 1 && activePage !== "students") return null;

              return (
                <td key={cellIndex} className="table-cell">
                  {cellIndex === 1 && activePage === "students" ? (
                    <img
                      src={cell || "icons/UserProfile.svg"}
                      alt="student"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    cell
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
