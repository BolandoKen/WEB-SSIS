import React, { useState } from "react";

function SignupForm({ onSubmit, onToggle }) {
  const [formData, setFormData] = useState({
    username: "",
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
    onSubmit(formData); // send actual user input
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="signup-header">
        <img src="icons/UserProfile.svg" alt="Logo" className="profile-pic" />
      </div>

      <input
        className="auth-input"
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <input
        className="auth-input"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        className="auth-input"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit" className="confirm-button">Sign Up</button>

      <p className="toggle-text">
        Already have an account?
        <span className="toggle-link" onClick={onToggle}> Login</span>
      </p>
    </form>
  );
}

export default SignupForm;
