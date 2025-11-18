import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { month: "Jan", revenue: 20000 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 28000 },
  { month: "Apr", revenue: 45000 },
  { month: "May", revenue: 50000 },
];

const ReportsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-lg text-gray-600 dark:text-gray-300">
            Total Revenue
          </h2>
          <p className="text-2xl font-bold mt-2 text-green-600">₹1,78,000</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-lg text-gray-600 dark:text-gray-300">
            Pending Amount
          </h2>
          <p className="text-2xl font-bold mt-2 text-red-600">₹32,000</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-lg text-gray-600 dark:text-gray-300">
            Invoices Generated
          </h2>
          <p className="text-2xl font-bold mt-2 text-blue-600">145</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Monthly Revenue Chart
        </h2>

        <LineChart width={700} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </div>

      {/* Yearly Report Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-300 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.month}
                className="border-t hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td classname="p-3">{row.month}</td>
                <td className="p-3">₹{row.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
