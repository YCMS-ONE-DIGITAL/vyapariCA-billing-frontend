import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Menu } from "lucide-react";

const Layout = () => {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="h-full">
          <Sidebar />
        </div>
      )}

      {/* Right Area */}
      <div className="flex flex-col flex-1 h-full bg-gray-100 overflow-hidden">
        {/* Header */}
        <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow flex-shrink-0">
          <div className="flex items-center gap-4">
            <Menu
              size={26}
              className="cursor-pointer text-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />

            <h2 className="text-xl font-semibold">Vyapari CA</h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-2.5 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none bg-gray-100 focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Main Page Content (Scrollable Only Here) */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Outlet context={{ searchQuery }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Layout;
