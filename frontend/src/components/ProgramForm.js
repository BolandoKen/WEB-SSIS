import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import '../styles/AddForm.css';

function ProgramForm({ onSubmit, onToggle }) {
    const [formData, setFormData] = useState({
        programName: '',
        programCode: '',
        college_id: '' // add field for selected college
    });

    const [collegeOptions, setCollegeOptions] = useState([]);

    useEffect(() => {
    fetch("http://127.0.0.1:5000/api/colleges")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((c) => ({
                value: c.id,           // now using college ID
                label: c.collegeName   // display name in dropdown
            }));
            setCollegeOptions(options);
        })
        .catch((err) => console.error("Error fetching colleges:", err));
    }, []);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCollegeChange = (selectedValue) => {
        setFormData({
            ...formData,
            college_id: parseInt(selectedValue)  // make sure it’s a number
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // send actual user input
    };

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
                label="College"
                options={collegeOptions}
                value={formData.college_id}
                onSelect={handleCollegeChange} 
            />
            <div className="button-section">
                <button type="button" className="cancel-button" onClick={onToggle}>Cancel</button>
                <button type="submit" className="confirm-button">Add Program</button>
            </div>
        </form>
    );
}

export default ProgramForm;
