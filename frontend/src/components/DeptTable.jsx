import React, {useState, useEffect} from "react";
import "../styles/Table.css";

function DeptTable({ columns, rows, onRowClick, onSort, sortConfig }) {
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
            className={`table-row ${
              selectedRow === rowIndex ? "selected" : ""
            }`}
            onClick={() => handleRowClick(row, rowIndex)}
          >
            {row.slice(1, columns.length + 1).map((cell, cellIndex) => (
              <td key={cellIndex} className="table-cell">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DeptTable;
