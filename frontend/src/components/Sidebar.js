import React from "react";
import Button from "./Button";       // reuse the Button component
import "../styles/Sidebar.css";      // sidebar-specific styles

function Sidebar({ setActivePage }) {
  return (
    <div className="sidebar">
      <Button onClick={() => setActivePage("students")} label="Students" icon="Users.svg" />
      <Button onClick={() => setActivePage("programs")} label="Programs" icon="File.svg" />
      <Button onClick={() => setActivePage("colleges")} label="Colleges" icon="Book.svg" />
    </div>
  );
}

export default Sidebar;
