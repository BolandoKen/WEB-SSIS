import React from "react";
import "../styles/Searchbar.css";

function SearchBar() {
  return (
    <div className="searchbar">
      <img
        src="/icons/search.svg" // put your search.svg inside /public/icons/
        alt="Search icon"
        className="search-icon"
      />
      <p className="searchbar-text">Search</p>
    </div>
  );
}

export default SearchBar;
