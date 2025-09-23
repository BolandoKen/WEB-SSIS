import React, { useState } from "react";

function LoginForm({ onSubmit, onToggle }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // send actual input values
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="signup-header">
        <img src="icons/UserProfile.svg" alt="Logo" className="profile-pic" />
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit" className="confirm-button">Log in</button>

      <p className="toggle-text">
        Don’t have an account?
        <span className="toggle-link" onClick={onToggle}> Sign Up</span>
      </p>
    </form>
  );
}

export default LoginForm;
