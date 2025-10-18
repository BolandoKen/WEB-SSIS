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
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="text-section">
        <p className="welcome-text">Welcome back</p>
        <p className="subtext">Enter your credentials to continue.</p>
      </div>

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

      <button type="submit" className="confirm-button">Log in</button>

      <p className="toggle-text">
        Don’t have an account?
        <span className="toggle-link" onClick={onToggle}> Sign Up</span>
      </p>
    </form>
  );
}

export default LoginForm;
