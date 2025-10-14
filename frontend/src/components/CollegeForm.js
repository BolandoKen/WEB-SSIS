import React, { useState, useEffect } from 'react';
import '../styles/AddForm.css';

function CollegeForm({ onSubmit, onToggle, selectedCollege, existingColleges }) {
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
      [name]: value // do NOT convert to uppercase
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check exact duplicates (case-sensitive)
    const codeExists = existingColleges.some(
      (c) => c.collegecode === formData.collegecode &&
             (!selectedCollege || c.id !== selectedCollege.id)
    );

    const nameExists = existingColleges.some(
      (c) => c.collegename === formData.collegename &&
             (!selectedCollege || c.id !== selectedCollege.id)
    );

    if (codeExists) {
      alert('⚠️ This college code already exists!');
      return;
    }

    if (nameExists) {
      alert('⚠️ This college name already exists!');
      return;
    }

    onSubmit(formData);
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
    </form>
  );
}

export default CollegeForm;
