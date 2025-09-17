import React from "react";
import "../styles/Box.css";
import SearchBar from "./Searchbar";
import Table from "./Table";

function Box({ tableHeaders, tableData }) {
  return (
    <div className="box">
      {/* Search section */}
      <div className="box-tool-section">
        <SearchBar />
      </div>

      {/* Table section */}
      <div className="box-table-section">
        <Table headers={tableHeaders} data={tableData} />
      </div>

      {/* Button section */}
      <div className="box-button-section">
        {/* You can drop AddButton, SaveButton, etc. here later */}
      </div>
    </div>
  );
}

export default Box;
