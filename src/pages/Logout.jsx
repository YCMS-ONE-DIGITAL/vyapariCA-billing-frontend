import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Clear user session / token / data
    localStorage.clear();
    sessionStorage.clear();

    // 🔹 Redirect to Login page
    navigate("/");
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
