import React from "react";

function SignupForm({ onSubmit, onToggle }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username: "newuser", password: "1234" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="signup-header">
        <img src="icons/UserProfile.svg" alt="Logo" className="profile-pic" />
      </div>
      <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Sign Up</button>

      <p className="toggle-text">
        Already have an account?
        <span className="toggle-link" onClick={onToggle}>
          {" "}Login
        </span>
      </p>
    </form>
  );
}


export default SignupForm;
