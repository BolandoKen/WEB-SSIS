import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from './Dropdown';
import '../styles/AddForm.css';

function ProgramForm({ isEditing, onSubmit, onToggle, selectedProgram }) {
  const [formData, setFormData] = useState({
    programName: '',
    programCode: '',
    college_id: '' 
  });
  const [collegeOptions, setCollegeOptions] = useState([]);

  useEffect(() => {
    if (selectedProgram) {
      const rawCollegeId =
        selectedProgram.college_id ??
        selectedProgram.collegeId ??
        selectedProgram.college?.id ??
        selectedProgram.collegeid; 
      setFormData({
        programName: selectedProgram.programname || selectedProgram.programName || '',
        programCode: selectedProgram.programcode || selectedProgram.programCode || '',
        college_id: rawCollegeId != null && rawCollegeId !== '' ? Number(rawCollegeId) : ''
      });
    } else {
      setFormData({ programName: '', programCode: '', college_id: '' });
    }
  }, [selectedProgram]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/colleges')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const options = data.map((c) => ({
          value: Number(c.id),
          label: `${c.collegecode ?? c.collegeCode ?? ''} - ${c.collegename ?? c.collegeName ?? c.collegeName ?? ''}`.replace(/^ - /, '').trim()
        }));
        setCollegeOptions(options);
        console.log('📥 loaded collegeOptions:', options);
      })
      .catch((err) => console.error('❌ Error fetching colleges:', err));
  }, []);

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleCollegeChange = (selectedValue) => {
    const num = selectedValue === '' || selectedValue == null ? '' : Number(selectedValue);
    setFormData((s) => ({ ...s, college_id: Number.isNaN(num) ? '' : num }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      programName: String(formData.programName).trim(),
      programCode: String(formData.programCode).trim(),
      college_id: formData.college_id 
    });
  };

  const selectedCollegeLabel = useMemo(() => {
   
    const programCollegeCode = selectedProgram?.collegecode ?? selectedProgram?.collegeCode;
    const programCollegeName = selectedProgram?.collegename ?? selectedProgram?.collegeName;
    if (isEditing && (programCollegeCode || programCollegeName)) {
      return `${programCollegeCode ?? ''}${programCollegeCode && programCollegeName ? ' - ' : ''}${programCollegeName ?? ''}`.replace(/^ - /, '').trim() || 'College';
    }

    if (formData.college_id !== '' && collegeOptions.length > 0) {
      const found = collegeOptions.find((opt) => opt.value === Number(formData.college_id));
      if (found) return found.label;
    }

  
    return 'College';
  }, [isEditing, selectedProgram, formData.college_id, collegeOptions]);

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="input-field"
        type="text"
        name="programName"
        placeholder="Name"
        value={formData.programName}
        onChange={handleChange}
        required
      />
      <input
        className="input-field"
        type="text"
        name="programCode"
        placeholder="Code"
        value={formData.programCode}
        onChange={handleChange}
        required
      />
      <Dropdown
        className="form-dropdown"
        label={selectedCollegeLabel}
        options={collegeOptions}
        value={formData.college_id}
        onSelect={handleCollegeChange}
      />
      <div className="button-section">
        <button type="button" className="cancel-button" onClick={onToggle}>Cancel</button>
        <button type="submit" className="confirm-button">
          {selectedProgram ? 'Save Changes' : 'Add Program'}
        </button>
      </div>
    </form>
  );
}

export default ProgramForm;
