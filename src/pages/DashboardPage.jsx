import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  CalendarDays,
  CalendarCheck,
  BarChart3,
  LineChart,
} from "lucide-react";

// -----------------------------------------------------
// SALES SUMMARY COMPONENT
// -----------------------------------------------------
const SalesSummary = ({ invoices }) => {
  const [today, setToday] = useState(0);
  const [yesterday, setYesterday] = useState(0);
  const [weekly, setWeekly] = useState(0);
  const [monthly, setMonthly] = useState(0);

  useEffect(() => {
    calculateSales(invoices);
  }, [invoices]);

  const calculateSales = (list) => {
    if (!list || list.length === 0) return;

    let todayTotal = 0,
      yesterdayTotal = 0,
      weeklyTotal = 0,
      monthlyTotal = 0;

    const now = new Date();
    const todayDate = now.toDateString();
    const yesterdayDate = new Date(
      now.setDate(now.getDate() - 1)
    ).toDateString();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    list.forEach((inv) => {
      const invDate = new Date(inv.date);

      if (invDate.toDateString() === todayDate) todayTotal += inv.totalAmount;

      if (invDate.toDateString() === yesterdayDate)
        yesterdayTotal += inv.totalAmount;

      if (invDate >= weekStart) weeklyTotal += inv.totalAmount;

      const thisMonth = new Date();
      if (
        invDate.getMonth() === thisMonth.getMonth() &&
        invDate.getFullYear() === thisMonth.getFullYear()
      ) {
        monthlyTotal += inv.totalAmount;
      }
    });

    setToday(todayTotal);
    setYesterday(yesterdayTotal);
    setWeekly(weeklyTotal);
    setMonthly(monthlyTotal);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* TODAY */}
      <div className="p-4 bg-white shadow rounded-2xl border hover:shadow-lg transition">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Today's Sales</h3>
          <CalendarDays className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold mt-2">₹ {today}</p>
      </div>

      {/* YESTERDAY */}
      <div className="p-4 bg-white shadow rounded-2xl border hover:shadow-lg transition">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Yesterday's Sales</h3>
          <CalendarCheck className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-2xl font-bold mt-2">₹ {yesterday}</p>
      </div>

      {/* WEEKLY */}
      <div className="p-4 bg-white shadow rounded-2xl border hover:shadow-lg transition">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Weekly Sales</h3>
          <BarChart3 className="w-5 h-5 text-purple-500" />
        </div>
        <p className="text-2xl font-bold mt-2">₹ {weekly}</p>
      </div>

      {/* MONTHLY */}
      <div className="p-4 bg-white shadow rounded-2xl border hover:shadow-lg transition">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Monthly Sales</h3>
          <LineChart className="w-5 h-5 text-orange-500" />
        </div>
        <p className="text-2xl font-bold mt-2">₹ {monthly}</p>
      </div>
    </div>
  );
};

// -----------------------------------------------------
// MAIN DASHBOARD PAGE
// -----------------------------------------------------
const data = [
  { month: "Jan", value: 20000 },
  { month: "Feb", value: 28000 },
  { month: "Mar", value: 35000 },
  { month: "Apr", value: 42000 },
  { month: "May", value: 39000 },
];

const DashboardPage = () => {
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

  // Load invoices
  const [invoices] = useState(() => {
    const saved = localStorage.getItem("vyapari_invoices");
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h1>

      {/* 🔵 NEW SALES SUMMARY CARDS */}
      <SalesSummary invoices={invoices} />

      {/* EXISTING CARDS */}
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

        <div
          className="bg-white p-6 rounded-xl shadow cursor-pointer"
          onClick={() => setShowInvoiceDetails(!showInvoiceDetails)}
        >
          <h3 className="text-lg font-bold text-green-600">Total Invoices</h3>
          <p className="text-2xl font-bold">145</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold text-red-600">Pending Payments</h3>
          <p className="text-2xl font-bold">₹32,000</p>
        </div>
      </motion.div>

      {/* CHART */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Monthly Revenue Chart
        </h2>

        <ReLineChart width={700} height={300} data={data}>
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
        </ReLineChart>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
