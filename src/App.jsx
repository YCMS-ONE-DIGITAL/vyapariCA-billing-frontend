import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";

import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const allPageRouter = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />, // 👈 no layout, standalone page
  },
  {
    path: "/dashboard",
    element: <DashboardPage />, // 👈 no layout, standalone page
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={allPageRouter} />
    </div>
  );
}
export default App;
