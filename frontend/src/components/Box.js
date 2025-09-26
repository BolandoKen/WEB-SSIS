import React from "react";
import Searchbar from "./Searchbar";
import Table from "./Table";
import Dropdown from "./Dropdown";
import OrderButton from "./OrderButton";
import PageButton from "./PageButton";
import CollegeForm from "./CollegeForm";
import "../styles/Box.css";

function Box({ activePage }) {
  let columns = [];
  let rows = [];
  let dropdownOptions = [];

  switch (activePage) {
    case "students":
      columns = ["ID Number", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      rows = [["2023-1864", "Kilmer Douglas Bernardo", "Bolando", "Male", "3", "BSCS"]];
      dropdownOptions = ["All", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      break;

    case "programs":
      columns = ["Code", "Name", "College"];
      rows = [["BSCS", "Bachelor of Science in Computer Science", "CSS"]];
      dropdownOptions = ["All", "Code", "Name", "College"];
      break;

    case "colleges":
      columns = ["Code", "Name"];
      rows = [["CCS", "College of Computer Studies"]];
      dropdownOptions = ["All", "Code", "Name"];
      break;

    default:
      columns = ["ID Number", "Firstname", "Lastname", "Gender", "Year Level", "Program"];
      rows = [];
      dropdownOptions = ["All"];
  }

  const handleSelect = (option) => {
    console.log("Selected:", option);
    // TODO: apply filtering based on option
  };

  return (
    <div className="box">
      <CollegeForm />
      
    </div>
  );
}

export default Box;
