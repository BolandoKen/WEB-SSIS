import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../styles/Login.css";

function AuthenticationPage({ onLogin }) {   // ✅ accept onLogin as a prop
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (username, password) => {
    if (username && password) {
      onLogin(username);   // ✅ now works
    } else {
      alert("Enter username and password");
    }
  };

  const handleSignup = (username, email, password) => {
    if (username && email && password) {
      alert(`Account created for ${username}`);
      setIsLogin(true);
    } else {
      alert("Fill in all fields");
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
