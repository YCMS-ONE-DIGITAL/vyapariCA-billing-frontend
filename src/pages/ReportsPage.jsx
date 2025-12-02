// ReportsAdvanced.jsx
// Full advanced reports dashboard (responsive + mobile friendly)
// Requirements:
//  npm install recharts html2canvas jspdf framer-motion lucide-react
// Tailwind CSS recommended for styles.

import React, { useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Download, Printer, FileText, RefreshCcw } from "lucide-react";

// ---------- Sample data (replace with API data) ----------
const sampleTopClients = [
  { name: "Rahul Traders", amount: 55000, invoices: 5 },
  { name: "OM Enterprises", amount: 42000, invoices: 3 },
  { name: "Shree Sales", amount: 38000, invoices: 4 },
  { name: "Global Traders", amount: 27000, invoices: 2 },
  { name: "Sai Distributors", amount: 15000, invoices: 1 },
];

const sampleProducts = [
  { id: 1, name: "Product A", qty: 120, revenue: 60000 },
  { id: 2, name: "Product B", qty: 80, revenue: 32000 },
  { id: 3, name: "Product C", qty: 40, revenue: 16000 },
];

const sampleTransactions = [
  {
    id: 1,
    date: "2025-11-22",
    client: "Rahul Traders",
    amount: 12000,
    paymentMode: "Cash",
    status: "Paid",
    gst: { taxable: 10000, cgst: 500, sgst: 500 },
    dueDate: null,
  },
  {
    id: 2,
    date: "2025-11-20",
    client: "OM Enterprises",
    amount: 14500,
    paymentMode: "UPI",
    status: "Partially Paid",
    gst: { taxable: 13000, cgst: 650, sgst: 650 },
    dueDate: "2025-12-05",
  },
  {
    id: 3,
    date: "2025-11-12",
    client: "Shree Sales",
    amount: 8000,
    paymentMode: "Card",
    status: "Unpaid",
    gst: { taxable: 7000, cgst: 500, sgst: 500 },
    dueDate: "2025-11-30",
  },
  {
    id: 4,
    date: "2025-10-25",
    client: "Global Traders",
    amount: 7000,
    paymentMode: "Bank Transfer",
    status: "Paid",
    gst: { taxable: 6000, cgst: 500, sgst: 500 },
    dueDate: null,
  },
  {
    id: 5,
    date: "2025-09-18",
    client: "Sai Distributors",
    amount: 15000,
    paymentMode: "Cash",
    status: "Paid",
    gst: { taxable: 14000, cgst: 500, sgst: 500 },
    dueDate: null,
  },
];

// Colors
const COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
];

// ---------- Helper format ----------
const fmt = (val) => `₹${Number(val).toLocaleString()}`;
const csvEscape = (v) => `"${String(v).replace(/"/g, '""')}"`;

// ---------- Component ----------
export default function ReportsAdvanced() {
  // Filters
  const [range, setRange] = useState("30d"); // options: 7d, 30d, 90d, all
  const [clientFilter, setClientFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Data (replace with fetch)
  const [transactions] = useState(sampleTransactions);
  const [topClients] = useState(sampleTopClients);
  const [products] = useState(sampleProducts);

  const dashboardRef = useRef();

  // ========= Filtering logic =========
  const now = new Date("2025-11-24"); // for samples; replace with new Date() in production
  const inRange = (iso) => {
    if (range === "all") return true;
    const d = new Date(iso);
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (range === "7d") return diffDays <= 7;
    if (range === "30d") return diffDays <= 30;
    if (range === "90d") return diffDays <= 90;
    return true;
  };

  const filtered = transactions.filter(
    (t) =>
      inRange(t.date) &&
      (clientFilter === "all" || t.client === clientFilter) &&
      (statusFilter === "all" || t.status === statusFilter) &&
      (paymentFilter === "all" || t.paymentMode === paymentFilter) &&
      (search.trim() === "" ||
        t.client.toLowerCase().includes(search.toLowerCase()) ||
        String(t.id).includes(search))
  );

  // ========= Aggregations =========
  const totalRevenue = filtered.reduce((s, t) => s + t.amount, 0);
  const invoiceCount = filtered.length;
  const avgInvoice = invoiceCount ? Math.round(totalRevenue / invoiceCount) : 0;

  // GST summary
  const gstSummary = filtered.reduce(
    (acc, t) => {
      acc.taxable += t.gst?.taxable || 0;
      acc.cgst += t.gst?.cgst || 0;
      acc.sgst += t.gst?.sgst || 0;
      acc.igst += t.gst?.igst || 0;
      return acc;
    },
    { taxable: 0, cgst: 0, sgst: 0, igst: 0 }
  );

  // Outstanding / pending
  const outstanding = filtered.filter((t) => t.status !== "Paid");

  // Payment mode breakdown
  const paymentModeMap = {};
  filtered.forEach((t) => {
    paymentModeMap[t.paymentMode] =
      (paymentModeMap[t.paymentMode] || 0) + t.amount;
  });
  const paymentModeData = Object.entries(paymentModeMap).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  // Monthly trend (group by month)
  const monthMap = {};
  filtered.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    monthMap[key] = (monthMap[key] || 0) + t.amount;
  });
  const monthData = Object.keys(monthMap)
    .sort()
    .map((k) => ({ month: k, revenue: monthMap[k] }));

  // Top products (already sample)
  const topProducts = products.slice().sort((a, b) => b.revenue - a.revenue);

  // Top clients from filtered transactions (by summing amounts)
  const clientMap = {};
  filtered.forEach(
    (t) => (clientMap[t.client] = (clientMap[t.client] || 0) + t.amount)
  );
  const topClientsFromTrans = Object.entries(clientMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // ========= Exports =========
  const exportCSV = () => {
    const headers = [
      "Invoice ID",
      "Date",
      "Client",
      "Amount",
      "Payment Mode",
      "Status",
      "Due Date",
    ];
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      t.client,
      t.amount,
      t.paymentMode,
      t.status,
      t.dueDate || "",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map(csvEscape).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`reports_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Small utilities for unique lists
  const uniqueClients = [
    "all",
    ...Array.from(new Set(transactions.map((t) => t.client))),
  ];
  const uniqueStatuses = [
    "all",
    ...Array.from(new Set(transactions.map((t) => t.status))),
  ];
  const uniquePayments = [
    "all",
    ...Array.from(new Set(transactions.map((t) => t.paymentMode))),
  ];

  // ========= UI =========
  return (
    <motion.div
      ref={dashboardRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 bg-gray-50 min-h-screen"
    >


      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>

            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              {uniqueClients.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All clients" : c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              {uniqueStatuses.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All status" : s}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              {uniquePayments.map((p) => (
                <option key={p} value={p}>
                  {p === "all" ? "All payments" : p}
                </option>
              ))}
            </select>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client or invoice ID"
              className="px-3 py-2 border rounded"
            />
            <button
              onClick={() => {
                setRange("30d");
                setClientFilter("all");
                setStatusFilter("all");
                setPaymentFilter("all");
                setSearch("");
              }}
              className="px-3 py-2 bg-gray-100 border rounded flex items-center gap-2"
            >
              <RefreshCcw size={16} /> Reset
            </button>
          </div>

          
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold mt-1">{fmt(totalRevenue)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500">Invoices</div>
          <div className="text-2xl font-bold mt-1">{invoiceCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500">Avg. Invoice</div>
          <div className="text-2xl font-bold mt-1">{fmt(avgInvoice)}</div>
        </div>
      </div>

      {/* Charts row: Bar (top clients) + Pie (payment modes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Top Clients</h3>
            <div className="text-sm text-gray-500">By revenue</div>
          </div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart
                data={
                  topClientsFromTrans.length
                    ? topClientsFromTrans
                    : topClients.slice(0, 5)
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => fmt(v)} />
                <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]}>
                  {(topClientsFromTrans.length
                    ? topClientsFromTrans
                    : topClients.slice(0, 5)
                  ).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Payment Mode Breakdown</h3>
            <div className="text-sm text-gray-500">Share</div>
          </div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={paymentModeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {paymentModeData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={28} />
                <Tooltip formatter={(v) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trends row: line + area (monthly) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Monthly Trend</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => fmt(v)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Income Growth</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={monthData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => fmt(v)} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GST summary + Top products + Outstanding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">GST Summary</h3>
          <div className="text-sm text-gray-600">
            Taxable:{" "}
            <span className="font-medium">{fmt(gstSummary.taxable)}</span>
          </div>
          <div className="text-sm text-gray-600">
            CGST: <span className="font-medium">{fmt(gstSummary.cgst)}</span>
          </div>
          <div className="text-sm text-gray-600">
            SGST: <span className="font-medium">{fmt(gstSummary.sgst)}</span>
          </div>
          <div className="text-sm text-gray-600">
            IGST: <span className="font-medium">{fmt(gstSummary.igst)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Top Products</h3>
          <div className="space-y-2">
            {topProducts.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.qty} sold</div>
                </div>
                <div className="font-semibold">{fmt(p.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Outstanding / Pending</h3>
          <div className="space-y-2 text-sm">
            {outstanding.length === 0 ? (
              <div className="text-gray-500">All paid</div>
            ) : (
              outstanding.slice(0, 6).map((t) => (
                <div key={t.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{t.client}</div>
                    <div className="text-xs text-gray-500">
                      {t.status} — Due {t.dueDate || "N/A"}
                    </div>
                  </div>
                  <div className="font-semibold">{fmt(t.amount)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </motion.div>
  );
}
