import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ContentBox from "./components/ContentBox";

function App() {
  const [activePage, setActivePage] = useState("students");

  return (
    <div className="app">
      <Sidebar setActivePage={setActivePage} />
      <ContentBox activePage={activePage} />
    </div>
  );
}

export default App;
