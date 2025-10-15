import React, { useState } from "react";
import Button from "./Button";
import "../styles/Sidebar.css";

function Sidebar({ setActivePage, onLogout }) {
  const [activeButton, setActiveButton] = useState("students");

  const handleClick = (page) => {
    setActivePage(page);
    setActiveButton(page);
  };

  return (
    <div className="sidebar">
      {/* Top section: Navigation */}
      <div className="sidebar-nav">
        <Button
          onClick={() => handleClick("students")}
          label="Students"
          icon="Users.svg"
          hoverIcon="Users.svg"
          activeIcon="UsersActive.svg"
          isActive={activeButton === "students"}
        />
        <Button
          onClick={() => handleClick("programs")}
          label="Programs"
          icon="File.svg"
          hoverIcon="File.svg"
          activeIcon="FileActive.svg"
          isActive={activeButton === "programs"}
        />
        <Button
          onClick={() => handleClick("colleges")}
          label="Colleges"
          icon="Book.svg"
          hoverIcon="Book.svg"
          activeIcon="BookActive.svg"
          isActive={activeButton === "colleges"}
        />
      </div>

      <div className="sidebar-footer">
        <Button
          className="logout-button"
          onClick={onLogout}
          label="Logout"
          icon="Logout.svg"
          hoverIcon="LogoutHover.svg"
        />
      </div>
    </div>
  );
}

export default Sidebar;
