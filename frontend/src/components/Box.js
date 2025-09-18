import React from "react";
import Searchbar from "./Searchbar";
import Table from "./Table";
import "../styles/Box.css";

function Box({ activePage }) {
  let columns = [];
  let rows = [];

  switch (activePage) {
    case "students":
      columns = ["ID Number", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      rows = [["2023-1864", "Kilmer Douglas Bernardo", "Bolando", "Male", "3", "BSCS"]];
      break;
    case "programs":
      columns = ["Code", "Name", "College"];
      rows = [["BSCS", "Bachelor of Science in Computer Science", "CSS"]];
      break;
    case "colleges":
      columns = ["Code", "Name"];
      rows = [["CCS", "College of Computer Studies"]];
      break;
    default:
      columns = ["ID Number", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      rows = [];
  }

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
