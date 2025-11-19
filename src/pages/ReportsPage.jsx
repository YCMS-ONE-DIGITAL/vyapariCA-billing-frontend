import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Receipt, IndianRupee } from "lucide-react";

const ReportsPage = () => {
  const topClients = [
    { name: "Rahul Traders", amount: 55000 },
    { name: "OM Enterprises", amount: 42000 },
    { name: "Shree Sales", amount: 38000 },
  ];

  const transactions = [
    { id: 1, date: "12 Nov 2025", client: "Rahul Traders", amount: 12000 },
    { id: 2, date: "10 Nov 2025", client: "Shree Sales", amount: 8000 },
    { id: 3, date: "08 Nov 2025", client: "OM Enterprises", amount: 14500 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Revenue */}
        <div className="p-6 bg-white rounded-xl shadow-md flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <IndianRupee className="text-green-600" size={30} />
          </div>
          <div>
            <p className="text-gray-600">Total Revenue</p>
            <h2 className="text-2xl font-bold text-green-600">₹1,78,000</h2>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="p-6 bg-white rounded-xl shadow-md flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-xl">
            <Receipt className="text-red-600" size={30} />
          </div>
          <div>
            <p className="text-gray-600">Pending Amount</p>
            <h2 className="text-2xl font-bold text-red-600">₹32,000</h2>
          </div>
        </div>

        {/* Total Clients */}
        <div className="p-6 bg-white rounded-xl shadow-md flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Users className="text-blue-600" size={30} />
          </div>
          <div>
            <p className="text-gray-600">Total Clients</p>
            <h2 className="text-2xl font-bold text-blue-600">145</h2>
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4">Top Paying Clients</h2>

        <div className="space-y-3">
          {topClients.map((client, idx) => (
            <div
              key={idx}
              className="flex justify-between p-4 border rounded-lg hover:bg-gray-100"
            >
              <span className="font-medium">{client.name}</span>
              <span className="font-bold text-green-600">₹{client.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">
          Recent Transactions
        </h2>

        <table className="w-full">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-100">
                <td className="p-3">{t.date}</td>
                <td className="p-3">{t.client}</td>
                <td className="p-3 font-semibold text-blue-600">₹{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
