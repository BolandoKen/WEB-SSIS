import React, { useState } from "react";
import "../styles/Searchbar.css";

function Searchbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [currentIcon, setCurrentIcon] = useState("/icons/ClearButton.svg");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setCurrentIcon("/icons/ClearButton.svg");
  };

  return (
    <div className="searchbar">
      <img
        src="/icons/search.svg"
        alt="Search icon"
        className="search-icon"
      />

      <input
        type="text"
        className="searchbar-text"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
      />

      {query && (
        <button
          className="clear-btn"
          onClick={handleClear}
          onMouseEnter={() => setCurrentIcon("/icons/ClearButtonHover.svg")}
          onMouseLeave={() => setCurrentIcon("/icons/ClearButton.svg")}
        >
          <img src={currentIcon} alt="Clear" className="clear-icon" />
        </button>
      )}
    </div>
  );
}

export default Searchbar;
