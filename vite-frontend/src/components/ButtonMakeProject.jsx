import React from "react";

// Styles for the button
const buttonStyles = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const ButtonMakeProject = ({
  label,
  onClick,
  color = "blue",
  textColor = "white",
}) => {
  return (
    <button
      style={{ ...buttonStyles, backgroundColor: color, color: textColor }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
