import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import TextPopup from "../components/TextPopup";
import DeletePopup from "../components/DeletePopup";
import "../styles/Login.css";

function AuthenticationPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [textPopupMessage, setTextPopupMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (formData) => {
    const { email, password } = formData;

    if (!email || !password) {
      setTextPopupMessage("Enter email and password");
      setShowTextPopup(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        // Save token to localStorage for persistence
        localStorage.setItem("token", data.token);
        // Send user info to parent component
        onLogin(data.user);
      } else {
        setTextPopupMessage(data.error || "Login failed");
        setShowTextPopup(true);
      }
    } catch (err) {
      setTextPopupMessage("Server error");
      setShowTextPopup(true);
      console.error(err);
    }
  };

  const handleSignup = async (formData) => {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setTextPopupMessage("Fill in all fields");
      setShowTextPopup(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`Account created for ${username}`);
        setShowSuccessPopup(true);
      } else {
        setTextPopupMessage(data.error || "Signup failed");
        setShowTextPopup(true);
      }
    } catch (err) {
      setTextPopupMessage("Server error");
      setShowTextPopup(true);
      console.error(err);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    setIsLogin(true); // switch to login after successful signup
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {isLogin ? (
          <LoginForm onSubmit={handleLogin} onToggle={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSubmit={handleSignup} onToggle={() => setIsLogin(true)} />
        )}
      </div>
      
      {showTextPopup && (
        <TextPopup
          message={textPopupMessage}
          onClose={() => setShowTextPopup(false)}
        />
      )}
      
      {showSuccessPopup && (
        <DeletePopup
          title="Success"
          message={successMessage}
          onClose={handleSuccessClose}
          onDeleteConfirm={handleSuccessClose}
          confirmText="OK"
        />
      )}
    </div>
  );
}

export default AuthenticationPage;