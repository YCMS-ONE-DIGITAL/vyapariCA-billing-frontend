// BillingPage.jsx (With GLOBAL SEARCH + MOBILE RESPONSIVE UI)
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Printer, Trash2 } from "lucide-react";

const SAMPLE_INVOICES = [
  {
    id: 1,
    invoiceNo: "INV-001",
    date: "2025-01-05",
    customer: "Rahul Sharma",
    status: "Full Paid",
    items: [
      { desc: "Product A", qty: 2, rate: 1000 },
      { desc: "Service B", qty: 1, rate: 3000 },
    ],
  },
  {
    id: 2,
    invoiceNo: "INV-002",
    date: "2025-01-10",
    customer: "Priya Patel",
    status: "UnPaid",
    items: [{ desc: "Product C", qty: 4, rate: 800 }],
  },
];

const STATUS_COLORS = {
  "Full Paid": "bg-green-600",
  UnPaid: "bg-red-600",
  Partial: "bg-yellow-500",
};

function formatCurrency(n) {
  return `₹${Number(n || 0).toFixed(2)}`;
}

export default function BillingPage() {
  const { searchQuery } = useOutletContext();

  const [invoices, setInvoices] = useState(() => {
    try {
      const raw = localStorage.getItem("vyapari_invoices");
      return raw ? JSON.parse(raw) : SAMPLE_INVOICES;
    } catch {
      return SAMPLE_INVOICES;
    }
  });

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem("vyapari_invoices", JSON.stringify(invoices));
  }, [invoices]);

  const confirmDelete = (id) => setDeleteId(id);

  const doDelete = () => {
    if (deleteId == null) return;
    setInvoices((prev) => prev.filter((i) => i.id !== deleteId));
    setDeleteId(null);
  };

  const calcItemsTotal = (items = []) =>
    items.reduce(
      (sum, it) => sum + Number(it.qty || 0) * Number(it.rate || 0),
      0
    );

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = (invoiceId) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const itemsHtml = (inv.items || [])
      .map(
        (it, idx) => `<tr>
          <td style="padding:8px;border:1px solid #ddd;text-align:center">${
            idx + 1
          }</td>
          <td style="padding:8px;border:1px solid #ddd">${it.desc}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center">${
            it.qty
          }</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right">${formatCurrency(
            it.rate
          )}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right">${formatCurrency(
            it.qty * it.rate
          )}</td>
        </tr>`
      )
      .join("");

    const subtotal = calcItemsTotal(inv.items || []);
    const total = subtotal;

    const html = `
      <!doctype html>
      <html>
      <head><meta charset="utf-8" /></head>
      <body>
      <h2>Invoice ${inv.invoiceNo}</h2>
      <p>Customer: ${inv.customer}</p>
      <p>Date: ${inv.date}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:20px">
      <thead><tr>
        <th style="padding:8px;border:1px solid #ddd">#</th>
        <th style="padding:8px;border:1px solid #ddd">Description</th>
        <th style="padding:8px;border:1px solid #ddd">Qty</th>
        <th style="padding:8px;border:1px solid #ddd">Rate</th>
        <th style="padding:8px;border:1px solid #ddd">Total</th>
      </tr></thead>
      <tbody>${itemsHtml}</tbody>
      </table>
      <h3>Grand Total: ${formatCurrency(total)}</h3>
      </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="p-4 sm:p-6 text-gray-900">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Billing</h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-200 text-gray-900">
            <tr>
              <th className="p-3 text-left">Sr.No</th>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">Invoice Date</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-left">Payment Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ? (
              filtered.map((inv, idx) => (
                <tr
                  key={inv.id}
                  className="border-b text-gray-900 hover:bg-gray-100"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{inv.invoiceNo}</td>
                  <td className="p-3">{inv.date}</td>
                  <td className="p-3">{inv.customer}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(calcItemsTotal(inv.items))}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-white px-3 py-1 rounded-full text-sm ${
                        STATUS_COLORS[inv.status]
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-4">
                    <button
                      onClick={() => handlePrint(inv.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Printer size={20} />
                    </button>

                    <button
                      onClick={() => confirmDelete(inv.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filtered.map((inv, idx) => (
          <div key={inv.id} className="bg-white shadow rounded-xl p-4 border">
            {/* TOP ROW */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">#{idx + 1}</span>

              <div className="flex gap-3">
                <Printer
                  size={20}
                  className="text-green-600 active:scale-90"
                  onClick={() => handlePrint(inv.id)}
                />

                <Trash2
                  size={20}
                  className="text-red-600 active:scale-90"
                  onClick={() => confirmDelete(inv.id)}
                />
              </div>
            </div>

            {/* MAIN INFO */}
            <p className="font-bold text-lg">{inv.invoiceNo}</p>
            <p className="text-gray-700 text-sm">Customer: {inv.customer}</p>
            <p className="text-gray-700 text-sm">Date: {inv.date}</p>

            {/* STATUS & AMOUNT */}
            <div className="flex justify-between items-center mt-3">
              <span
                className={`text-white px-3 py-1 rounded-full text-xs ${
                  STATUS_COLORS[inv.status]
                }`}
              >
                {inv.status}
              </span>

              <span className="font-semibold text-base">
                {formatCurrency(calcItemsTotal(inv.items))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteId != null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-medium mb-2">Delete Invoice</h3>
            <p className="mb-4">Are you sure?</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="px-3 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
