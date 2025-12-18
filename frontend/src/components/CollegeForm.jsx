import React, { useState, useEffect } from 'react';
import TextPopup from './TextPopup';
import DeletePopup from './DeletePopup';
import '../styles/AddForm.css';

function CollegeForm({ onSubmit, onToggle, selectedCollege, existingColleges }) {
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [textPopupMessage, setTextPopupMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const isEditing = !!selectedCollege;
    const [textPopupTitle, setTextPopupTitle] = useState("");
  
  const [formData, setFormData] = useState({
    collegename: '',
    collegecode: ''
  });

  useEffect(() => {
    if (selectedCollege) {
      setFormData({
        collegename: selectedCollege.collegename || '',
        collegecode: selectedCollege.collegecode || ''
      });
    } else {
      setFormData({
        collegename: '',
        collegecode: ''
      });
    }
  }, [selectedCollege]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value 
    });
  };

  const handleConfirmSubmit = () => {
    setShowConfirmPopup(false);
    onSubmit(formData);
  };

  const handleCancelSubmit = () => {
    setShowConfirmPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const codeExists = existingColleges.some(
      (c) => c.collegecode === formData.collegecode &&
            (!selectedCollege || c.id !== selectedCollege.id)
    );

    const nameExists = existingColleges.some(
      (c) => c.collegename === formData.collegename &&
            (!selectedCollege || c.id !== selectedCollege.id)
    );

    if (codeExists) {
      setTextPopupMessage("This college code already exists.");
      setShowTextPopup(true);
      return;
    }

    if (nameExists) {
      setTextPopupMessage("This college name already exists.");
      setShowTextPopup(true);
      return;
    }

    setShowConfirmPopup(true);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="input-field"
        type="text"
        name="collegename"
        placeholder="Name"
        value={formData.collegename}
        onChange={handleChange}
        required
      />
      <input
        className="input-field"
        type="text"
        name="collegecode"
        placeholder="Code"
        value={formData.collegecode}
        onChange={handleChange}
        required
      />
      <div className="button-section">
        <button type="button" className="cancel-button" onClick={onToggle}>
          Cancel
        </button>
        <button type="submit" className="confirm-button">
          {selectedCollege ? 'Save Changes' : 'Add College'}
        </button>
      </div>
      {showTextPopup && (
          <TextPopup
            message={textPopupMessage}
            onClose={() => setShowTextPopup(false)}
            title={textPopupTitle}
          />
      )}
      {showConfirmPopup && (
        <DeletePopup
          title="Confirm Changes"
          message={
            isEditing
              ? "Are you sure you want to save these changes?"
              : "Are you sure you want to add this college?"
          }
          onClose={handleCancelSubmit}
          onDeleteConfirm={handleConfirmSubmit}
          confirmText={isEditing ? "Save" : "Add"}
        />
      )}
    </form>
  );
}

export default CollegeForm;
