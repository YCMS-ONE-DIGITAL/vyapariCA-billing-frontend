import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const confirmLogout = () => {
    
    localStorage.removeItem("vyapari_user");
    setShowLogoutPopup(false);
    navigate("/"); // login page ला redirect
  };

  return (
    <>
      <div className="flex flex-col justify-between w-64 bg-white shadow-lg min-h-screen border-r">
        <div>
          {/* 🔵 Logo Section */}
          <div className="px-6 py-5 bg-blue-600 text-white">
            <h1 className="text-2xl font-semibold">Vyapari CA</h1>
            <p className="text-sm opacity-90">CA & Business Management Suite</p>
          </div>

          {/* Menu Items */}
          <div className="mt-4 flex flex-col gap-1">
            <SidebarItem
              to="/app/dashboard"
              icon={<Home size={18} />}
              label="Dashboard"
            />
            <SidebarItem
              to="/app/clients"
              icon={<Users size={18} />}
              label="Clients"
            />
            <SidebarItem
              to="/app/billing"
              icon={<FileText size={18} />}
              label="Billing"
            />
            <SidebarItem
              to="/app/invoices"
              icon={<FileText size={18} />}
              label="Invoices"
            />

            <SidebarItem
              to="/app/products"
              icon={<ShoppingBag size={18} />}
              label="Products"
            />
            <SidebarItem
              to="/app/reports"
              icon={<BarChart2 size={18} />}
              label="Reports"
            />
            <SidebarItem
              to="/app/settings"
              icon={<Settings size={18} />}
              label="Settings"
            />
          </div>
        </div>

        {/* Logout Button (Bottom) */}
        <div className="px-6 py-4">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 font-semibold border border-red-400 rounded-lg hover:bg-red-50 w-full justify-center transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-3">Confirm Logout</h2>
            <p className="text-gray-700 mb-5">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-6 py-3 rounded-lg mx-3 transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span className="text-base">{label}</span>
    </NavLink>
  );
};

export default Sidebar;
