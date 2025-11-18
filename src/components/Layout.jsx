import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AnimatePresence, motion } from "framer-motion";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex">
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Right side content */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        {/* 🔵 Top Header */}
        <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow">
          <h2 className="text-xl font-semibold">Vyapari CA</h2>
        </header>

        {/* Page Content with animation */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Layout;
