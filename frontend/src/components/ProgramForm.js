import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from './Dropdown';
import '../styles/AddForm.css';

function ProgramForm({ isEditing, onSubmit, onToggle, selectedProgram }) {
  const [formData, setFormData] = useState({
    programName: '',
    programCode: '',
    college_id: '' // keep '' for "no selection", otherwise a Number
  });
  const [collegeOptions, setCollegeOptions] = useState([]);

  // load selected program into the form (coerce college_id to Number when present)
  useEffect(() => {
    console.log('🔍 selectedProgram:', selectedProgram);
    if (selectedProgram) {
      const rawCollegeId =
        selectedProgram.college_id ??
        selectedProgram.collegeId ??
        selectedProgram.college?.id ??
        selectedProgram.collegeid; // try a few possible keys just in case
      setFormData({
        programName: selectedProgram.programname || selectedProgram.programName || '',
        programCode: selectedProgram.programcode || selectedProgram.programCode || '',
        college_id: rawCollegeId != null && rawCollegeId !== '' ? Number(rawCollegeId) : ''
      });
      console.log('✅ Set college_id to:', rawCollegeId);
    } else {
      setFormData({ programName: '', programCode: '', college_id: '' });
    }
  }, [selectedProgram]);

  // fetch colleges once
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/colleges')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Ensure value is numeric
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
    // selectedValue should be numeric (Dropdown returns option.value), but guard just in case
    const num = selectedValue === '' || selectedValue == null ? '' : Number(selectedValue);
    setFormData((s) => ({ ...s, college_id: Number.isNaN(num) ? '' : num }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // trim text inputs
    onSubmit({
      programName: String(formData.programName).trim(),
      programCode: String(formData.programCode).trim(),
      college_id: formData.college_id // numeric or ''
    });
  };

  // compute the label reactively:
  const selectedCollegeLabel = useMemo(() => {
    // 1) If we're editing and the selectedProgram already includes human-readable college data, use it immediately
    const programCollegeCode = selectedProgram?.collegecode ?? selectedProgram?.collegeCode;
    const programCollegeName = selectedProgram?.collegename ?? selectedProgram?.collegeName;
    if (isEditing && (programCollegeCode || programCollegeName)) {
      return `${programCollegeCode ?? ''}${programCollegeCode && programCollegeName ? ' - ' : ''}${programCollegeName ?? ''}`.replace(/^ - /, '').trim() || 'College';
    }

    // 2) Otherwise lookup in loaded options by matching numeric id
    if (formData.college_id !== '' && collegeOptions.length > 0) {
      const found = collegeOptions.find((opt) => opt.value === Number(formData.college_id));
      if (found) return found.label;
    }

    // default
    return 'College';
  }, [isEditing, selectedProgram, formData.college_id, collegeOptions]);

  // helpful debug logs
  useEffect(() => {
    console.log('📋 formData.college_id:', formData.college_id);
    console.log('📋 collegeOptions ids:', collegeOptions.map((o) => o.value));
    console.log('🔖 selectedCollegeLabel:', selectedCollegeLabel);
  }, [formData.college_id, collegeOptions, selectedCollegeLabel]);

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
