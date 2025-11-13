import React from "react";

const Button = ({ text, color = "bg-blue-600 hover:bg-blue-700", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white px-4 py-2 rounded-lg transition font-medium`}
    >
      {text}
    </button>
  );
};

export default Button;
