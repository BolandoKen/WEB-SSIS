import React from "react";
import Searchbar from "./Searchbar";
import Table from "./Table";
import "../styles/Box.css";

function Box() {
  const columns = ["ID Number", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
  const rows = [
    ["2023-1864", "Kilmer Douglas Bernardo", "Bolando", "Male", "3", "BSCS"]
  ];

  return (
    <div className="box">
      <div className="box-tool-section">
        <Searchbar />
      </div>

      <div className="box-table-section">
        <Table columns={columns} rows={rows} />
      </div>

      <div className="box-button-section">
        {/* later: add buttons here */}
      </div>
    </div>
  );
}

export default Box;
