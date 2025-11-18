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
import ReportsPage from "./pages/ReportsPage";
import ForgotPassword from "./pages/ForgotPassword";
import ProductPage from "./pages/ProductPage";
import SettingsPage from "./pages/SettingsPage";
import Logout from "./pages/Logout";

// Layout
import Layout from "./components/Layout";

const router = createBrowserRouter([
  // DEFAULT ENTRY → Redirect to Login Page
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // LOGIN PAGE
  {
    path: "/login",
    element: <LoginPage />,
  },

  // FORGOT PASSWORD
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // ALL LOGGED-IN PAGES
  {
    path: "/app",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "clients", element: <ClientsPage /> },
      { path: "billing", element: <BillingPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "products", element: <ProductPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
