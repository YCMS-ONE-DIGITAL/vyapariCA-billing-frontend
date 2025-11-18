import React from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-xl">
        {/* Blue Header Section */}
        <div className="bg-blue-600 text-white p-5 rounded-lg mb-6 text-center">
          <h1 className="text-2xl font-semibold">Vyapari CA Login</h1>
          <p className="text-sm mt-1">CA & Business Management Suite</p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your email to receive password reset instructions.
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email Address</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          Send Reset Link
        </button>

        {/* Back to login */}
        <div className="text-center mt-5">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
