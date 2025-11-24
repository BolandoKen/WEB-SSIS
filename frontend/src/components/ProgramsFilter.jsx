import React, { useState, useEffect } from "react";

function ProgramsFilter({ onCollegeSelect }) {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/colleges/")
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch((err) => console.error("Failed to fetch colleges:", err));
  }, []);

  const handleChange = (e) => {
    setSelectedCollege(e.target.value);
    if (onCollegeSelect) onCollegeSelect(e.target.value);
  };

  return (
    <div>
      <label htmlFor="college-select">Filter by College:</label>
      <select id="college-select" value={selectedCollege} onChange={handleChange}>
        <option value="">All Colleges</option>
        {colleges.map((college) => (
          <option key={college.id} value={college.id}>
            {college.collegeName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProgramsFilter;
