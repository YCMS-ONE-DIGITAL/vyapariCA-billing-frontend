import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pages = [
    { name: "dashboard", path: "/dashboard" },
    { name: "clients", path: "/clients" },
    { name: "products", path: "/products" },
    { name: "billing", path: "/billing" },
    { name: "reports", path: "/reports" },
    { name: "settings", path: "/settings" },
    { name: "my business", path: "/my-business" },
  ];

  // 🔍 Search and auto-navigate
  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      const match = pages.find((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (match) {
        navigate(match.path);
        setSearchQuery("");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50"
          >
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 lg:hidden"
        ></div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="w-full bg-white shadow p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Menu
              className="lg:hidden cursor-pointer"
              size={26}
              onClick={() => setSidebarOpen(true)}
            />
            <h1 className="text-xl font-semibold">Vyapari CA</h1>
          </div>

          {/* Search Box */}
          <div className="relative w-60 md:w-72">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-600"
            />
            <input
              type="text"
              placeholder="Search page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchEnter}
              className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-lg outline-blue-500"
            />

            {/* SEARCH SUGGESTIONS */}
            {searchQuery && (
              <div className="absolute top-11 left-0 w-full bg-white shadow-lg rounded-md p-2 z-50">
                {pages
                  .filter((p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((p) => (
                    <p
                      key={p.path}
                      onClick={() => {
                        navigate(p.path);
                        setSearchQuery("");
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      {p.name}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-6 w-full overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet context={{ searchQuery }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
