// BillingPage.jsx (With POS View Bill Modal)
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Printer, Trash2, Eye } from "lucide-react";

const SAMPLE_INVOICES = [
  {
    id: 1,
    invoiceNo: "INV-001",
    date: "2025-01-05",
    customer: "Rahul Sharma",
    status: "Paid",
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
  Paid: "bg-green-600",
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

  const [viewInvoice, setViewInvoice] = useState(null);

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

  const handlePrint = (inv) => {
    const itemsHtml = (inv.items || [])
      .map(
        (it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.desc}</td>
        <td>${it.qty}</td>
        <td>${it.rate}</td>
        <td>${it.qty * it.rate}</td>
      </tr>`
      )
      .join("");

    const subtotal = calcItemsTotal(inv.items || []);

    const html = `
  <html>
    <head>
      <style>
        body { margin:0; padding:0; font-family: Arial; }
        .receipt { width:58mm; padding:10px; margin: 0 auto; text-align: center; }
        table { width:100%; font-size:12px; border-collapse:collapse; }
        th, td { padding:4px 0; border-bottom:1px dashed #000; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <h2 style="text-align:center">VYAPARI CA</h2>
        <p><strong>Invoice:</strong> ${inv.invoiceNo}</p>
        <p><strong>Date:</strong> ${inv.date}</p>
        <p><strong>Customer:</strong> ${inv.customer}</p>

        <table>
          <thead>
            <tr>
              <th>#</th><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <h3>Total: ₹${subtotal}</h3>
      </div>

      <script>
        window.onload = () => window.print();
      </script>
    </body>
  </html>
  `;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="p-4 sm:p-6 text-gray-900">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Billing</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-200">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="p-3 text-left">Sr.No</th>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">Invoice Date</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-center">Amount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ? (
              filtered.map((inv, idx) => (
                <tr key={inv.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{inv.invoiceNo}</td>
                  <td className="p-3">{inv.date}</td>
                  <td className="p-3">{inv.customer}</td>

                  <td className="p-3 text-center font-semibold">
                    {formatCurrency(calcItemsTotal(inv.items))}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`text-white px-3 py-1 rounded-full text-sm ${
                        STATUS_COLORS[inv.status]
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="p-3 text-center flex justify-center gap-4">
                    {/* VIEW */}
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={20} />
                    </button>

                    {/* PRINT */}
                    <button
                      onClick={() => handlePrint(inv)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Printer size={20} />
                    </button>

                    {/* DELETE */}
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
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =============== VIEW BILL MODAL (POS STYLE) =============== */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-xs rounded-lg p-4 shadow-lg">
            <div className="text-center text-lg font-bold mb-2">VYAPARI CA</div>

            <p>
              <strong>Invoice:</strong> {viewInvoice.invoiceNo}
            </p>
            <p>
              <strong>Date:</strong> {viewInvoice.date}
            </p>
            <p>
              <strong>Customer:</strong> {viewInvoice.customer}
            </p>

            <hr className="my-3" />

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Item</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-center py-1">Rate</th>
                  <th className="text-right py-1">Total</th>
                </tr>
              </thead>

              <tbody>
                {viewInvoice.items.map((it, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-1">{it.desc}</td>
                    <td className="py-1 text-center">{it.qty}</td>
                    <td className="py-1 text-center">{it.rate}</td>
                    <td className="py-1 text-right">{it.qty * it.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="text-right text-lg font-semibold mt-3">
              Total: ₹{calcItemsTotal(viewInvoice.items)}
            </h3>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>

              <button
                onClick={() => handlePrint(viewInvoice)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
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
