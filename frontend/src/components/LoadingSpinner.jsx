import React from 'react';
import "../styles/LoadingSpinner.css";

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-spinner-overlay">
      <span class="loader"></span>
    </div>
  );
}

export default LoadingSpinner;
