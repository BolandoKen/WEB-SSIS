import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ContentBox from "./components/ContentBox";
import AuthenticationPage from "./pages/AuthenticationPage";

function App() {
  const [activePage, setActivePage] = useState("students");
  const [user, setUser] = useState(null); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); 
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://127.0.0.1:5000/api/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData); // auto-login
      } else {
        localStorage.removeItem("token"); // invalid token
      }
    };

    checkLogin();
  }, []);
  
  if (!user) {
    return <AuthenticationPage onLogin={setUser} />; 
  }

  return (
    <div className="app">
      <Sidebar 
        setActivePage={setActivePage} 
        onLogout={handleLogout}
      />
      <ContentBox activePage={activePage} />
    </div>
  );
}

export default App;
