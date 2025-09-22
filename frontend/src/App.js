import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ContentBox from "./components/ContentBox";
import AuthenticationPage from "./pages/AuthenticationPage";

function App() {
  const [activePage, setActivePage] = useState("students");
  
  const [user, setUser] = useState(null); // null means not logged in

  if (!user) {
    return <AuthenticationPage onLogin={setUser} />; // show login page first
  }

  return (
    <div className="app">
      <Sidebar setActivePage={setActivePage} />
      <ContentBox activePage={activePage} />
    </div>
  );
}

export default App;
