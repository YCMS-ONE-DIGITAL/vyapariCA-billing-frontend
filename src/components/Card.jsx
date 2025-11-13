import React from "react";

const Card = ({ title, value, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className={`text-2xl mt-2 font-bold ${color}`}>{value}</p>
    </div>
  );
};

export default Card;
