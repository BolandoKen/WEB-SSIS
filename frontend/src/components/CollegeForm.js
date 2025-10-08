import React, { useState, useEffect } from 'react';
import '../styles/AddForm.css';

function CollegeForm({ onSubmit, onToggle, selectedCollege }) {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        >
          {selectedCollege ? 'Save Changes' : 'Add College'}
        </button>
      </div>
    </form>
  );
}

export default CollegeForm;
