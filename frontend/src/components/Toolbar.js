import React from "react";
import "../styles/Toolbar.css";
import IconButton from "./IconButton";

function Toolbar({ 
  title, 
  showIconButtons = true, 
  selectedRow, 
  activePage, 
  onDeleteSuccess, 
  onEdit // 👈 new prop
}) {
  const handleDelete = async () => {
    if (!selectedRow) return;

    const id = selectedRow[0]; // integer ID
    let endpoint = "";

    switch (activePage) {
      case "colleges":
        endpoint = "/api/colleges";
        break;
      case "programs":
        endpoint = "/api/programs";
        break;
      case "students":
        endpoint = "/api/students";
        break;
      default:
        console.error("Unknown page:", activePage);
        return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000${endpoint}?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data.message || "Deleted successfully");
        if (onDeleteSuccess) onDeleteSuccess(id);
      } else {
        console.error(data.error || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="toolbar">
      <p className="title">{title}</p>
      {showIconButtons && (
        <div className="toolbar-actions">
          <IconButton
            icon="/icons/Edit.svg"
            hoverIcon="/icons/EditHover.svg"
            onClick={() => {
              if (!selectedRow) {
                console.warn("⚠️ No row selected to edit");
                return;
              }
              onEdit?.(selectedRow);
            }}
          />
          <IconButton
            icon="/icons/Trash.svg"
            hoverIcon="/icons/TrashHover.svg"
            onClick={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

export default Toolbar;
