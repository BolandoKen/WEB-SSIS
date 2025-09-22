import React from "react";

function LoginForm({ onSubmit, onToggle }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username: "demo", password: "demo" });
  };

  return (
    <form onSubmit={handleSubmit}>
       <div className="signup-header">
        <img src="icons/UserProfile.svg" alt="Logo" className="profile-pic" />
      </div>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit" className="confirm-button">Log in</button>

      <p className="toggle-text">
        Don’t have an account?
        <span className="toggle-link" onClick={onToggle}>
          {" "}Sign Up
        </span>
      </p>
    </form>
  );
}


export default LoginForm;
