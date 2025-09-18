import React from "react";
import { useState } from "react";  // to manage active button state
import Button from "./Button";       // reuse the Button component
import "../styles/Sidebar.css";      // sidebar-specific styles

function Sidebar({ setActivePage }) {
  const [activeButton, setActiveButton] = useState("students"); // default active

  const handleClick = (page) => {
    setActivePage(page);      // update content
    setActiveButton(page);    // update appearance
  };

  return (
    <div className="sidebar">
      <Button
        onClick={() => handleClick("students")}
        label="Students"
        icon="Users.svg"
        activeIcon="UsersActive.svg"
        isActive={activeButton === "students"}
      />
      <Button
        onClick={() => handleClick("programs")}
        label="Programs"
        icon="File.svg"
        activeIcon="FileActive.svg"
        isActive={activeButton === "programs"}
      />
      <Button
        onClick={() => handleClick("colleges")}
        label="Colleges"
        icon="Book.svg"
        activeIcon="BookActive.svg"
        isActive={activeButton === "colleges"}
      />
    </div>
  );
}

export default Sidebar;