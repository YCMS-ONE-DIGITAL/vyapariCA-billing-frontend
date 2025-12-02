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
  Building2,
  CreditCard,
  IndianRupee,
} from "lucide-react";

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem("vyapari_user");
    setShowLogoutPopup(false);
    navigate("/");
    if (onClose) onClose();
  };

  return (
    <>
      <div className="flex flex-col justify-between w-64 bg-white shadow-lg h-full border-r">
        <div>
          <div className="px-6 py-5 bg-blue-600 text-white">
            <h1 className="text-2xl font-semibold">Vyapari CA</h1>
            <p className="text-sm opacity-90">CA & Business Management Suite</p>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <SidebarItem
              to="/app/dashboard"
              icon={<Home size={18} />}
              label="Dashboard"
              onClose={onClose}
            />
            <SidebarItem
              to="/app/clients"
              icon={<Users size={18} />}
              label="Clients"
              onClose={onClose}
            />
            <SidebarItem
              to="/app/billing"
              icon={<FileText size={18} />}
              label="Billing"
              onClose={onClose}
            />
            <SidebarItem
              to="/app/invoices"
              icon={<FileText size={18} />}
              label="Invoices"
              onClose={onClose}
            />
            <SidebarItem
              to="/app/products"
              icon={<ShoppingBag size={18} />}
              label="Products"
              onClose={onClose}
            />
            <SidebarItem
              to="/app/payment"
              icon={<IndianRupee size={18} />}
              label="Payment"
              onClose={onClose}
            />
            <SidebarItem
              to="/app/reports"
              icon={<BarChart2 size={18} />}
              label="Reports"
              onClose={onClose}
            />
            <SidebarItem
              to="/app/my-business"
              icon={<Building2 size={18} />}
              label="My Business"
              onClose={onClose}
            />
            <SidebarItem
              to="/app/settings"
              icon={<Settings size={18} />}
              label="Settings"
              onClose={onClose}
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 font-semibold border border-red-400 rounded-lg hover:bg-red-50 w-full justify-center transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {showLogoutPopup && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
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

const SidebarItem = ({ to, icon, label, onClose }) => {
  return (
    <NavLink
      to={to}
      onClick={() => onClose && onClose()}
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
