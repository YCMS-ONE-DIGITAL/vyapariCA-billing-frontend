import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", value: 20000 },
  { month: "Feb", value: 28000 },
  { month: "Mar", value: 35000 },
  { month: "Apr", value: 42000 },
  { month: "May", value: 39000 },
];

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h1>

      {/* Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold text-blue-600">Total Clients</h3>
          <p className="text-2xl font-bold">24</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold text-green-600">
            Total Invoices
          </h3>
          <p className="text-2xl font-bold">145</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold text-red-600">Pending Payments</h3>
          <p className="text-2xl font-bold">₹32,000</p>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Monthly Revenue Chart
        </h2>

        <LineChart width={700} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
