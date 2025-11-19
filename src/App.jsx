// src/App.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import BillingPage from "./pages/BillingPage";
import InvoicePage from "./pages/InvoicePage";
import ReportsPage from "./pages/ReportsPage";
import ProductPage from "./pages/ProductPage";
import SettingsPage from "./pages/SettingsPage";
import MyBusiness from "./pages/MyBusiness";
import ForgotPassword from "./pages/ForgotPassword";
import Logout from "./pages/Logout";

// Layout
import Layout from "./components/Layout";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },

  // ---------- Public Routes ----------
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  // ---------- Protected Routes with Layout ----------
  {
    path: "/app",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "clients", element: <ClientsPage /> },
      { path: "billing", element: <BillingPage /> },
      { path: "invoices", element: <InvoicePage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "products", element: <ProductPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "logout", element: <Logout /> },
      { path: "my-business", element: <MyBusiness /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
