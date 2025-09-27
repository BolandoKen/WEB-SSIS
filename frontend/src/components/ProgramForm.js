import React, { useState } from 'react';
import Dropdown from './Dropdown';
import '../styles/AddForm.css';

function ProgramForm({ onSubmit, onToggle }) {
    const [formData, setFormData] = useState({
        programName: '',
        programCode: ''
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
                name="programName"
                placeholder="Name"
                value={formData.programName}
                onChange={handleChange}
                required
            />
            <input
                className='input-field'
                type="text"
                name="programCode"
                placeholder="Code"
                value={formData.programCode}
                onChange={handleChange}
                required
            />
            <Dropdown
                className="college-dropdown"
                label={"College"}
                options={["College A", "College B", "College C"]}
                value={formData.college}
                onChange={handleChange}
            />
            <div className="button-section">
                <button type="button" className="cancel-button" onClick={onToggle}>Cancel</button>
                <button type="submit" className="confirm-button">Add Program</button>
            </div>
        </form>
    );
}

export default ProgramForm;