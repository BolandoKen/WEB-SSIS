import { useEffect, useState } from "react";

function StudentFilter({ onFilter }) {
  const [yearLevel, setYearLevel] = useState("");
  const [gender, setGender] = useState("");
  const [programCode, setProgramCode] = useState("");
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/programs")
      .then(res => res.json())
      .then(data => setPrograms(data))
      .catch(err => console.error("Failed to load programs:", err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (yearLevel) params.append("yearlevel", yearLevel);
    if (gender) params.append("gender", gender);
    if (programCode) params.append("programcode", programCode);

    // Only filter if at least one criterion is selected
    if (yearLevel || gender || programCode) {
      fetch(`http://127.0.0.1:5000/api/students/filter?${params.toString()}`)
        .then(res => res.json())
        .then(data => onFilter(data))
        .catch(err => console.error("Filter failed:", err));
    } else {
      onFilter(null); // reset to all students
    }
  }, [yearLevel, gender, programCode]);

  const resetFilter = () => {
    setYearLevel("");
    setGender("");
    setProgramCode("");
  };

  return (
    <div className="student-filter">
      {/* Year Level */}
      <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
        <option value="">Year Level</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>

      {/* Gender */}
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      {/* Program */}
      <select value={programCode} onChange={(e) => setProgramCode(e.target.value)}>
        <option value="">Program</option>
        {programs.map(p => (
          <option key={p.id} value={p.programcode}>
            {p.programcode}
          </option>
        ))}
      </select>
      <button onClick={resetFilter}>Reset</button>
    </div>
  );
}

export default StudentFilter;
