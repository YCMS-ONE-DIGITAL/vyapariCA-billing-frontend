import React from "react";

const Card = ({ title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
};

export default Card;
