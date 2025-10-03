import React, { useState } from 'react';
import '../styles/AddForm.css';

function CollegeForm({ onSubmit, onToggle }) {
    const [formData, setFormData] = useState({
        collegename: '',
        collegecode: ''
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
                name="collegename"
                placeholder="Name"
                value={formData.collegename}
                onChange={handleChange}
                required
            />
            <input
                className='input-field'
                type="text"
                name="collegecode"
                placeholder="Code"
                value={formData.collegecode}
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