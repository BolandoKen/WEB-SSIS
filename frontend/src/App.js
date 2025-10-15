import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ContentBox from "./components/ContentBox";
import AuthenticationPage from "./pages/AuthenticationPage";

function App() {
  const [activePage, setActivePage] = useState("students");
  const [user, setUser] = useState(null); 

  const handleLogout = () => {
    setUser(null); // This will show the AuthenticationPage again
  };
  
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
