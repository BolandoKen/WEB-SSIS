import React from "react";
import Button from "./Button";       // reuse the Button component
import "../styles/Sidebar.css";      // sidebar-specific styles

function Sidebar() {
  return (
    <div className="sidebar">
      <Button href="/students" label="Students" icon="Users.svg" />
      <Button href="/programs" label="Programs" icon="File.svg" />
      <Button href="/colleges" label="Colleges" icon="Book.svg" />
    </div>
  );
}

export default Sidebar;
