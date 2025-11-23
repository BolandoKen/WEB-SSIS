import React, { useState, useEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import "../styles/AddForm.css";
import Popup from "./Popup";
import LoadingSpinner from "./LoadingSpinner";

function StudentForm({ isEditing, onSubmit, onToggle, selectedStudent }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    idNumber: "",
    yearLevel: "",
    college_id: "",
    program_id: "",
    profile_photo_url: "",
  });

  const [collegeOptions, setCollegeOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [idError, setIdError] = useState("");

  const canSubmit = 
    formData.firstname.trim() !== "" &&
    formData.lastname.trim() !== "" &&
    formData.idNumber.trim() !== "" &&
    formData.gender !== "" &&
    formData.yearLevel !== "" &&
    formData.college_id !== "" &&
    formData.program_id !== "" &&
    !idError;

  // useEffect(() => {
  //   if (selectedStudent?.profile_photo_url) {
  //     setImageLoading(true);
  //   }
  // }, [selectedStudent]);

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        firstname: selectedStudent.firstname || "",
        lastname: selectedStudent.lastname || "",
        gender: selectedStudent.gender || "",
        idNumber: selectedStudent.idnumber || "",
        yearLevel: selectedStudent.yearlevel || "",
        college_id: selectedStudent.college_id || "",
        program_id: selectedStudent.program_id || "",
        profile_photo_url: selectedStudent.profile_photo_url || "",
      });

      setInitialLoading(false);  
    } else {
      setFormData({
        firstname: "",
        lastname: "",
        gender: "",
        idNumber: "",
        yearLevel: "",
        college_id: "",
        program_id: "",
        profile_photo_url: "",
      });

      setInitialLoading(false);  
    }
  }, [selectedStudent]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/colleges")
      .then((res) => res.json())
      .then((data) => {
        setCollegeOptions(
          data.map((c) => ({
            value: c.id,
            label: `${c.collegeCode} - ${c.collegeName}`,
          }))
        );
      });
  }, []);

  useEffect(() => {
    if (!formData.college_id) return;
    fetch(`http://127.0.0.1:5000/api/programs?college_id=${formData.college_id}`)
      .then((res) => res.json())
      .then((data) => {
        setProgramOptions(
          data.map((p) => ({
            value: p.id,
            label: p.programname,
          }))
        );
      });
  }, [formData.college_id]);

  useEffect(() => {
    console.log("Selected student:", selectedStudent);
    console.log("Form data after selecting:", formData);
  }, [formData, selectedStudent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDropdown = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "college_id" ? { program_id: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idError) return;

    const confirmed = isEditing
      ? window.confirm("Are you sure you want to save these changes?")
      : window.confirm("Are you sure you want to add this student?");
    
    if (!confirmed) return; 

    onSubmit(formData);
  };

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="profile-section">
        <div className="profile-container">
          {imageLoading || uploading ? (
            <LoadingSpinner />
          ) : (
            <img
              src={formData.profile_photo_url || "icons/UserProfile.svg"}
              alt="profile"
              className="profile-pic"
              onClick={() => fileInputRef.current.click()}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setUploading(true);

            try {
              // delete old file
              if (formData.profile_photo_url) {
                const oldFilePath = formData.profile_photo_url.split(
                  "/storage/v1/object/public/student-photos/"
                )[1];

                if (oldFilePath) {
                  await fetch(
                    `http://127.0.0.1:5000/api/students/delete-profile?filename=${oldFilePath}`,
                    { method: "DELETE" }
                  );
                }
              }

              const form = new FormData();
              form.append("file", file);

              const res = await fetch(
                "http://127.0.0.1:5000/api/students/upload-profile",
                {
                  method: "POST",
                  body: form,
                }
              );

              const data = await res.json();
              if (data.url) {
                setFormData((prev) => ({ ...prev, profile_photo_url: data.url }));
              }
            } catch (err) {
              console.error("Upload error:", err);
            } finally {
              setUploading(false);
            }
          }}
        />
      </div>
      <div className="name-section">
        <input
          className="input-field"
          type="text"
          name="firstname"
          placeholder="Firstname"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
        <input
          className="input-field"
          type="text"
          name="lastname"
          placeholder="Lastname"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
      </div>

      <div className="detail-section">
        <Dropdown
          className="form-dropdown"
          label={formData.gender || "Gender"}
          options={["Male", "Female"]}
          value={formData.gender}
          onSelect={(val) => handleDropdown("gender", val)}
        />
        {/* ID Number */}
        <input
          className="input-field"
          type="text"
          name="idNumber"
          placeholder="0000-0000"
          value={formData.idNumber}
          onChange={async (e) => {
            let value = e.target.value.replace(/[^\d-]/g, "");

            if (/^\d{4}$/.test(value)) {
              value = value + "-";
            }

            if (value.length <= 9) {
              setFormData({ ...formData, idNumber: value });
            }

            if (/^\d{4}-\d{4}$/.test(value)) {
              try {
                const res = await fetch(`http://127.0.0.1:5000/api/students/check-id/${value}`);
                const data = await res.json();

                if (data.exists) {
                  alert("⚠️ This ID number already exists! Please use another.");
                  setFormData((prev) => ({ ...prev, idNumber: "" }));
                }
              } catch (err) {
                console.error("Error checking ID:", err);
              }
            }
          }}
          pattern="\d{4}-\d{4}"
          title="ID number must be in the format 0000-0000"
          required
        />

        <Dropdown
          className="form-dropdown"
          label={formData.yearLevel || "Year Level"}
          options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
          value={formData.yearLevel}
          onSelect={(val) => handleDropdown("yearLevel", val)}
        />
      </div>

    <div className="dropdown-section">
    {/* College Dropdown */}
    <Dropdown
        className="form-dropdown"
        label={collegeOptions.find((opt) => opt.value === Number(formData.college_id))?.label || "College"}
        options={collegeOptions}
        value={formData.college_id}
        onSelect={(val) => handleDropdown("college_id", val)}
    />

    {/* Program Dropdown */}
    <Dropdown
        className="form-dropdown"
        label={programOptions.find((opt) => opt.value === Number(formData.program_id))?.label || "Program"}
        options={programOptions}
        value={formData.program_id}
        onSelect={(val) => handleDropdown("program_id", val)}
        disabled={!formData.college_id}
    />
    </div>


      <div className="button-section">
        <button 
          type="button"   
          className="cancel-button"   
          onClick={onToggle}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="confirm-button"
          disabled={!canSubmit}
        >
          {isEditing ? "Save Changes" : "Add Student"}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
