import React, { useState, useEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import "../styles/AddForm.css";
import Popup from "./Popup";
import LoadingSpinner from "./LoadingSpinner";

function StudentForm({ isEditing, onSubmit, onToggle, selectedStudent }) {
  const fileInputRef = useRef(null);
  const uploadedFilesRef = useRef([]); // Track all newly uploaded files in this session
  const originalPhotoRef = useRef(null); // Track original photo URL
  
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
  const imageLoadTimeoutRef = useRef(null);

  const canSubmit = 
    formData.firstname.trim() !== "" &&
    formData.lastname.trim() !== "" &&
    formData.idNumber.trim() !== "" &&
    formData.gender !== "" &&
    formData.yearLevel !== "" &&
    formData.college_id !== "" &&
    formData.program_id !== "" &&
    !idError;

  useEffect(() => {
    // Clear any existing timeout
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
    }

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
      
      // Store original photo URL
      originalPhotoRef.current = selectedStudent.profile_photo_url || null;
      
      // Only show loading spinner if there's an actual photo URL (not the default icon)
      if (selectedStudent.profile_photo_url && selectedStudent.profile_photo_url !== "") {
        setImageLoading(true);
        
        // Fallback: stop loading after 3 seconds if onLoad doesn't fire
        imageLoadTimeoutRef.current = setTimeout(() => {
          setImageLoading(false);
        }, 3000);
      } else {
        setImageLoading(false);
      }
      
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
      
      originalPhotoRef.current = null;
      setImageLoading(false);
      setInitialLoading(false);  
    }
    
    // Reset uploaded files tracker
    uploadedFilesRef.current = [];
    
    // Cleanup timeout on unmount
    return () => {
      if (imageLoadTimeoutRef.current) {
        clearTimeout(imageLoadTimeoutRef.current);
      }
    };
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

  const deleteUploadedFile = async (fileUrl) => {
    if (!fileUrl) return;
    
    const filePath = fileUrl.split("/storage/v1/object/public/student-photos/")[1];
    if (!filePath) return;

    try {
      await fetch(
        `http://127.0.0.1:5000/api/students/delete-profile?filename=${filePath}`,
        { method: "DELETE" }
      );
      console.log("Deleted uploaded file:", filePath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleRemoveImage = async () => {
    const currentUrl = formData.profile_photo_url;
    if (!currentUrl) return;

    // Show loading spinner
    setUploading(true);

    // Extract filename from URL
    const filename = currentUrl.split("/storage/v1/object/public/student-photos/")[1];
    if (!filename) {
      setUploading(false);
      return;
    }

    try {
      // Delete from server
      await fetch(
        `http://127.0.0.1:5000/api/students/delete-profile?filename=${filename}`,
        { method: "DELETE" }
      );

      // Remove from newly uploaded list (if applicable)
      uploadedFilesRef.current = uploadedFilesRef.current.filter(
        (f) => f !== currentUrl
      );

      // Clear UI
      setFormData((prev) => ({
        ...prev,
        profile_photo_url: ""
      }));

      // If editing, mark the original photo as "removed"
      if (isEditing) {
        originalPhotoRef.current = null;
      }
    } catch (err) {
      console.error("Error removing image:", err);
    } finally {
      // Hide loading spinner
      setUploading(false);
    }
  };

  const handleCancel = async () => {
    // Delete all newly uploaded files from this session
    for (const fileUrl of uploadedFilesRef.current) {
      await deleteUploadedFile(fileUrl);
    }
    
    onToggle();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (idError) return;

    const confirmed = isEditing
      ? window.confirm("Are you sure you want to save these changes?")
      : window.confirm("Are you sure you want to add this student?");
    
    if (!confirmed) {
      // User cancelled submission - delete all newly uploaded files
      for (const fileUrl of uploadedFilesRef.current) {
        await deleteUploadedFile(fileUrl);
      }
      
      // Restore original photo if editing
      if (isEditing && originalPhotoRef.current) {
        setFormData(prev => ({ ...prev, profile_photo_url: originalPhotoRef.current }));
      } else {
        setFormData(prev => ({ ...prev, profile_photo_url: "" }));
      }
      
      uploadedFilesRef.current = [];
      return;
    }

    // User confirmed - now delete the original photo if we uploaded a new one
    if (isEditing && originalPhotoRef.current && formData.profile_photo_url !== originalPhotoRef.current) {
      await deleteUploadedFile(originalPhotoRef.current);
    }

    // Clear the tracking since we're submitting successfully
    uploadedFilesRef.current = [];
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
              onLoad={() => {
                setImageLoading(false);
                if (imageLoadTimeoutRef.current) {
                  clearTimeout(imageLoadTimeoutRef.current);
                }
              }}
              onError={() => {
                setImageLoading(false);
                if (imageLoadTimeoutRef.current) {
                  clearTimeout(imageLoadTimeoutRef.current);
                }
              }}
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

            // Only allow images
            if (!file.type.startsWith("image/")) {
              alert("Only image files are allowed.");
              e.target.value = ""; // reset file input
              return;
            }

            // Limit size to 2MB
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
              alert("The selected image is too large. Maximum allowed size is 2MB.");
              e.target.value = "";
              return;
            }

            setUploading(true);

            try {
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
                uploadedFilesRef.current.push(data.url);
                setFormData((prev) => ({ ...prev, profile_photo_url: data.url }));
                
                // Set image loading to show spinner until new image loads
                setImageLoading(true);
                
                // Fallback timeout
                imageLoadTimeoutRef.current = setTimeout(() => {
                  setImageLoading(false);
                }, 3000);
              }
            } catch (err) {
              console.error("Upload error:", err);
            } finally {
              setUploading(false);
            }
          }}
        />
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
          <button 
            type="button"   
            className="cancel-button"
            onClick={handleRemoveImage}
          >
            Remove Image
          </button>
        </div>
      </div>
      <div className="detail-section">
        <Dropdown
          className="form-dropdown"
          label={formData.gender || "Gender"}
          options={["Male", "Female"]}
          value={formData.gender}
          onSelect={(val) => handleDropdown("gender", val)}
        />
        
        <input
          className="input-field"
          type="text"
          name="idNumber"
          placeholder="0000-0000"
          id="idnumber-field"
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
        <Dropdown
          className="form-dropdown"
          label={collegeOptions.find((opt) => opt.value === Number(formData.college_id))?.label || "College"}
          options={collegeOptions}
          value={formData.college_id}
          onSelect={(val) => handleDropdown("college_id", val)}
        />

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
          onClick={handleCancel}
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