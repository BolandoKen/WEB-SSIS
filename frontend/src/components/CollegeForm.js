import React, { useState } from 'react';
import '../styles/CollegeForm.css';

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
        <form className="college-form" onSubmit={handleSubmit}>
            <input
                className='college-input'
                type="text"
                name="collegeName"
                placeholder="Name"
                value={formData.collegeName}
                onChange={handleChange}
                required
            />
            <input
                className='college-input'
                type="text"
                name="collegeCode"
                placeholder="Code"
                value={formData.collegeCode}
                onChange={handleChange}
                required
            />
            <div className="button-section">
                <button type="button" className="confirm-button" onClick={onToggle}>Cancel</button>
                <button type="submit" className="confirm-button">Add College</button>
            </div>
        </form>
    );
}

export default CollegeForm;