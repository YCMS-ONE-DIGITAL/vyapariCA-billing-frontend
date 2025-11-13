import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import React from "react";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Clients" value="24" color="text-blue-600" />
          <Card title="Invoices Generated" value="145" color="text-green-600" />
          <Card title="Pending Payments" value="₹32,000" color="text-red-600" />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
