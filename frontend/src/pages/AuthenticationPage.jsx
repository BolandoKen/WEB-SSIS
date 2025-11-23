import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../styles/Login.css";

function AuthenticationPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (formData) => {
    const { email, password } = formData;

    if (!email || !password) {
      alert("Enter email and password");
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
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };


  const handleSignup = async (formData) => {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      alert("Fill in all fields");
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
        alert(`Account created for ${username}`);
        setIsLogin(true); // switch to login
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
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
    </div>
  );
}

export default AuthenticationPage;