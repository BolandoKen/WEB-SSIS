import React, { useState } from "react";
import "../styles/OrderButton.css";

function OrderButton({ upIcon, upHover, downIcon, downHover, onClick }) {
  const [isUp, setIsUp] = useState(true);       // track sort direction
  const [currentIcon, setCurrentIcon] = useState(upIcon);

  const handleClick = () => {
    setIsUp(!isUp); // toggle direction

    // Update current icon immediately
    setCurrentIcon(!isUp ? upIcon : downIcon);

    if (onClick) onClick(!isUp); // optional callback
  };

  const handleMouseEnter = () => {
    setCurrentIcon(isUp ? upHover : downHover);
  };

  const handleMouseLeave = () => {
    setCurrentIcon(isUp ? upIcon : downIcon);
  };

  return (
    <button
      className="order-button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={currentIcon} alt="sort icon" className="btn-icon" />
    </button>
  );
}

export default OrderButton;
