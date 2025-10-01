import React, { useEffect, useState } from 'react';
import Dropdown from './Dropdown';
import '../styles/AddForm.css';

function StudentForm({ onSubmit, onToggle }) {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',  // Fixed: was "Lastname"
        Gender: '',
        IdNumber: '',
        YearLevel: '',
        program_id: ''
    });

    const [collegeOptions, setCollegeOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/colleges")
            .then((res) => res.json())
            .then((data) => {
                const options = data.map((c) => ({
                    value: c.id,
                    label: c.collegeName
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

    const handleCollegeChange = async (selectedValue) => {
        const collegeId = parseInt(selectedValue);

        // update formData
        setFormData({
            ...formData,
            college_id: collegeId,
            program_id: '' // reset program selection
        });

        // fetch programs for the selected college
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/programs?college_id=${collegeId}`);
            const data = await res.json();

            // map programs to dropdown format
            const options = data.map((p) => ({
                value: p.id,
                label: p.programName
            }));
            setProgramOptions(options);
        } catch (err) {
            console.error("Error fetching programs:", err);
            setProgramOptions([]);
        }
    };

    const handleProgramChange = (selectedValue) => {
        setFormData({
            ...formData,
            program_id: parseInt(selectedValue)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    }

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <div className="name-section">
                <input
                    className='input-field'
                    id='studentName-field'
                    type="text"
                    name="FirstName"  // Fixed: was "Firstname"
                    placeholder="Firstname"
                    value={formData.FirstName}  // Fixed: was "Firstname"
                    onChange={handleChange}
                    required
                />
                <input
                    className='input-field'
                    id="studentName-field"
                    type="text"
                    name="LastName"  // Fixed: was "Lastname"
                    placeholder="Lastname"
                    value={formData.LastName}  // Fixed: was "Lastname"
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
                    onSelect={(val) => setFormData({ ...formData, Gender: val })}
                />
                <input
                    className='input-field'
                    id='idNumber-field'
                    type="text"
                    name="IdNumber"
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
                    onSelect={(val) => setFormData({ ...formData, YearLevel: val })}
                />
            </div>
            <div className="dropdown-section">
                <Dropdown
                    className="form-dropdown"
                    label="College"
                    options={collegeOptions}
                    value={formData.college_id}
                    onSelect={handleCollegeChange}
                />
                <Dropdown
                    label="Program"
                    options={programOptions}
                    value={formData.program_id}
                    onSelect={handleProgramChange}
                    disabled={!formData.college_id}
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