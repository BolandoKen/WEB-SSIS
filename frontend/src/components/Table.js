import React, {useState} from "react";
import "../styles/Table.css";

function Table({ columns, rows, onRowClick }) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row, rowIndex) => {
    if (selectedRow === rowIndex) {
      // unselect if clicked again
      setSelectedRow(null);
      if (onRowClick) onRowClick(null, null);
    } else {
      // select new row
      setSelectedRow(rowIndex);
      if (onRowClick) onRowClick(row, rowIndex);
    }
  };

  return (
    <table className="table">
      <thead className="table-header">
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="table-header-text">
              {col}
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
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="table-cell"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
