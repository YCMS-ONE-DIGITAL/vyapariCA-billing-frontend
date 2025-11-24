// BillingPage.jsx (Table Only - Responsive on All Devices)
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Printer, Trash2 } from "lucide-react";

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
        body {
          margin: 0;
          padding: 0;
          font-family: Arial;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          height: 100vh;
        }

        .receipt {
          width: 58mm;
          padding: 10px;
        }

        h2, p { margin: 4px 0; }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        th, td {
          border-bottom: 1px dashed #000;
          padding: 6px 0;
          text-align: left;
        }
      </style>
    </head>

    <body>
      <div class="receipt">
        <h2>VYAPARI CA</h2>
        <p><strong>Invoice:</strong> ${inv.invoiceNo}</p>
        <p><strong>Date:</strong> ${inv.date}</p>
        <p><strong>Customer:</strong> ${inv.customer}</p>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
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

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-gray-900">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Sr.No</th>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">Invoice Date</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-center">Amount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ? (
              filtered.map((inv, idx) => (
                <tr key={inv.id} className="border-b hover:bg-gray-100">
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
