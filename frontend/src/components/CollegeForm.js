import React, { useState } from 'react';
import '../styles/AddForm.css';

function CollegeForm({ onSubmit, onToggle }) {
    const [formData, setFormData] = useState({
        collegeName: '',
        collegeCode: ''
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // send actual user input
    }
    
    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <input
                className='input-field'
                type="text"
                name="collegeName"
                placeholder="Name"
                value={formData.collegeName}
                onChange={handleChange}
                required
            />
            <input
                className='input-field'
                type="text"
                name="collegeCode"
                placeholder="Code"
                value={formData.collegeCode}
                onChange={handleChange}
                required
            />
            <div className="button-section">
                <button type="button" className="cancel-button" onClick={onToggle}>Cancel</button>
                <button type="submit" className="confirm-button">Add College</button>
            </div>
        </form>
    );
}

export default CollegeForm;