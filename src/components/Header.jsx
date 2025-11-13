import Button from "./Button";
import React from "react";

const Header = ({ onLogout }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <h1 className="text-xl font-bold text-gray-700">
        Vyapari CA Billing System
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600 font-medium">Welcome, Admin</span>
        <Button
          text="Logout"
          color="bg-red-600 hover:bg-red-700"
          onClick={onLogout}
        />
      </div>
    </header>
  );
};

export default Header;
