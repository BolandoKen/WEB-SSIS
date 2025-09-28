import React, { useState } from 'react';
import Dropdown from './Dropdown';
import '../styles/AddForm.css';

function StudentForm({ onSubmit, onToggle }) {
    const [formData, setFormData] = useState({
        FirstName: '',
        Lastname: '',
        Gender: '',
        IdNumber: '',
        YearLevel: '',
        ProgramCode: ''
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
            <div className="name-section">
                <input
                    className='input-field'
                    id='studentName-field'
                    type="text"
                    name="Firstname"
                    placeholder="Firstname"
                    value={formData.Firstname}
                    onChange={handleChange}
                    required
                />
                <input
                    className='input-field'
                    id="studentName-field"
                    type="text"
                    name="Lastname"
                    placeholder="Lastname"
                    value={formData.Lastname}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="detail-section">
                 <Dropdown
                    className="form-dropdown"
                    id="gender-dropdown"
                    label={"Gender"}
                    options={["Male", "Female"]}
                    value={formData.Gender}
                />
                <input
                    className='input-field'
                    id='idNumber-field'
                    type="text"
                    name="IdNumber"    // <-- matches state now
                    placeholder="0000-0000"
                    value={formData.IdNumber}
                    onChange={handleChange}
                    required
                    maxLength={9}
                />
                <Dropdown
                    className="form-dropdown"
                    id="yearLevel-dropdown"
                    label={"Year Level"}
                    options={["1st Year", "2nd Year", "3rd Year", "4th Year", "4+ Years"]}
                    value={formData.YearLevel}
                />
            </div>
            <div className="dropdown-section">
                <Dropdown
                    className="form-dropdown"
                    label={"College"}
                    options={["College A", "College B", "College C"]}
                    value={formData.College}
                    onChange={handleChange}
                />
                <Dropdown
                    className="form-dropdown"
                    label={"Program"}
                    options={["Program 1", "Program 2"]}
                    value={formData.ProgramCode}
                />
            </div>
            <div className="button-section">
                <button type="button" className="cancel-button" onClick={onToggle}>Cancel</button>
                <button type="submit" className="confirm-button">Add Student</button>
            </div>
        </form>
    );
}

export default StudentForm;