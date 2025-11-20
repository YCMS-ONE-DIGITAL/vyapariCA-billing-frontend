import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@vyapari.com" && password === "12345") {
      // ✅ Correct Redirect Path
      navigate("/app/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl w-[360px] shadow-lg">
        
        {/* 🔵 Header */}
        <div className="bg-blue-600 text-white rounded-t-2xl p-6 text-center">
          <h2 className="text-2xl font-bold">Vyapari CA Login</h2>
          <p className="text-sm opacity-90 mt-1">
            CA & Business Management Suite
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-lg px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {/* Show Password */}
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="text-gray-700 text-sm">
                Remember Me 
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>

            {/* Forgot Password */}
            <p className="text-center mt-3">
              <a
                href="/forgot-password"
                className="text-blue-600 font-medium hover:underline"
              >
                Forgot Password?
              </a>
            </p>

            {/* Create Account */}
            <p className="text-center mt-2 text-gray-700">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Create Account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
