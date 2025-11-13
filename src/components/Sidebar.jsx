import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-blue-700 text-white p-6">
      <h2 className="text-2xl font-bold">Vyapari CA</h2>
      <ul className="mt-6 space-y-3">
        <li>
          <a href="#" className="block py-2 px-3 hover:bg-blue-600 rounded">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 hover:bg-blue-600 rounded">
            Clients
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 hover:bg-blue-600 rounded">
            Billing
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 hover:bg-blue-600 rounded">
            Reports
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
