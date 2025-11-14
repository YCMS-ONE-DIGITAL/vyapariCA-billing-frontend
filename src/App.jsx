import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const allPageRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "*",
    element: <h1>404 Page Not Found</h1>,
  },
]);

function App() {
  return <RouterProvider router={allPageRouter} />;
}

export default App;
