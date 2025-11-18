import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login data (optional)
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/");
  };

  return (
    <aside className="w-64 bg-blue-700 text-white p-6 min-h-screen flex flex-col justify-between">
      {/* TOP MENU */}
      <div>
        <h2 className="text-2xl font-bold">Vyapari CA</h2>

        <ul className="mt-6 space-y-3">
          <li>
            <Link
              to="dashboard"
              className="block py-2 px-3 hover:bg-blue-600 rounded"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="clients"
              className="block py-2 px-3 hover:bg-blue-600 rounded"
            >
              Clients
            </Link>
          </li>

          <li>
            <Link
              to="billing"
              className="block py-2 px-3 hover:bg-blue-600 rounded"
            >
              Billing
            </Link>
          </li>

          <li>
            <Link
              to="reports"
              className="block py-2 px-3 hover:bg-blue-600 rounded"
            >
              Reports
            </Link>
          </li>

          <li>
            <Link
              to="products"
              className="block py-2 px-3 hover:bg-blue-600 rounded"
            >
              Products
            </Link>
          </li>
        </ul>
      </div>

      {/* BOTTOM MENU */}
      <div className="space-y-3">
        <Link
          to="settings"
          className="block py-2 px-3 hover:bg-blue-600 rounded"
        >
          Settings
        </Link>

        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 bg-red-600 hover:bg-red-500 rounded text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
