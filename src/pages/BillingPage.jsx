// src/pages/BillingPage.jsx
import React, { useEffect, useState } from "react";

/**
 * Optimized BillingPage.jsx (Option B)
 * - Add / Edit invoice modal (single modal)
 * - Delete confirmation modal
 * - Search filter
 * - Professional print template (opens new window)
 * - Dark / Light theme toggle (persists in localStorage)
 * - Persists invoices in localStorage (so data survives reload)
 *
 * Drop this file into src/pages/BillingPage.jsx (replace previous).
 * Requires Tailwind (optional — classes can be adapted to plain CSS).
 */

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
  // persistence: invoices + theme
  const [invoices, setInvoices] = useState(() => {
    try {
      const raw = localStorage.getItem("vyapari_invoices");
      return raw ? JSON.parse(raw) : SAMPLE_INVOICES;
    } catch {
      return SAMPLE_INVOICES;
    }
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null => add mode
  const [deleteId, setDeleteId] = useState(null);
  const [themeDark, setThemeDark] = useState(() => {
    try {
      return localStorage.getItem("vyapari_theme") === "dark";
    } catch {
      return false;
    }
  });

  // form (shared for add/edit)
  const emptyForm = {
    invoiceNo: "",
    date: "",
    customer: "",
    status: "UnPaid",
    items: [{ desc: "", qty: 1, rate: 0 }],
  };
  const [form, setForm] = useState(emptyForm);

  // persist invoices and theme
  useEffect(() => {
    localStorage.setItem("vyapari_invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("vyapari_theme", themeDark ? "dark" : "light");
    if (themeDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [themeDark]);

  // helpers
  const resetForm = () => setForm(emptyForm);

  const openAdd = () => {
    resetForm();
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (inv) => {
    setEditingId(inv.id);
    setForm({
      invoiceNo: inv.invoiceNo,
      date: inv.date,
      customer: inv.customer,
      status: inv.status || "UnPaid",
      items: inv.items?.map((it) => ({ ...it })) || [
        { desc: "", qty: 1, rate: 0 },
      ],
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleItemChange = (idx, key, value) => {
    setForm((s) => {
      const items = [...s.items];
      items[idx] = {
        ...items[idx],
        [key]: key === "qty" || key === "rate" ? Number(value) : value,
      };
      return { ...s, items };
    });
  };

  const addItem = () =>
    setForm((s) => ({
      ...s,
      items: [...s.items, { desc: "", qty: 1, rate: 0 }],
    }));
  const removeItem = (idx) =>
    setForm((s) => ({ ...s, items: s.items.filter((_, i) => i !== idx) }));

  const calcItemsTotal = (items = []) =>
    items.reduce(
      (sum, it) => sum + Number(it.qty || 0) * Number(it.rate || 0),
      0
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.invoiceNo || !form.date || !form.customer) {
      alert("Invoice No, Date and Customer are required.");
      return;
    }

    const amount = calcItemsTotal(form.items);

    if (editingId) {
      setInvoices((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form, amount } : p))
      );
      alert("Invoice updated");
    } else {
      const newId = invoices.length
        ? Math.max(...invoices.map((i) => i.id)) + 1
        : 1;
      setInvoices((prev) => [...prev, { id: newId, ...form, amount }]);
      alert("Invoice added");
    }

    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const confirmDelete = (id) => setDeleteId(id);
  const doDelete = () => {
    if (deleteId == null) return;
    setInvoices((prev) => prev.filter((i) => i.id !== deleteId));
    setDeleteId(null);
  };

  // Search filter
  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase())
  );

  // Print professional template (opens new window)
  const handlePrint = (invoiceId) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    const itemsHtml = (inv.items || [])
      .map(
        (it, idx) => `<tr>
          <td style="padding:8px;border:1px solid #ddd;text-align:center">${
            idx + 1
          }</td>
          <td style="padding:8px;border:1px solid #ddd">${escapeHtml(
            it.desc
          )}</td>
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
    const tax = 0; // you can calculate GST here
    const total = subtotal + tax;

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(inv.invoiceNo)}</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;color:#222;margin:20px}
    .top{display:flex;justify-content:space-between;align-items:flex-start}
    .brand{font-weight:800;color:#0b63d6;font-size:20px}
    .meta{font-size:13px;color:#444}
    table{width:100%;border-collapse:collapse;margin-top:18px}
    th{background:#0b63d6;color:#fff;padding:10px;text-align:left}
    td{padding:8px;border:1px solid #ddd}
    .right{text-align:right}
    .totals td{border:none;padding:6px 8px}
    .footer{margin-top:24px;color:#555;font-size:13px}
    @media print {.no-print{display:none}}
  </style>
</head>
<body>
  <div class="top">
    <div>
      <div class="brand">Vyapari CA</div>
      <div class="meta">CA & Business Management Suite</div>
      <div class="meta">Address: Your business address here</div>
    </div>
    <div class="meta right">
      <div><strong>Invoice</strong></div>
      <div>Invoice No: <strong>${escapeHtml(inv.invoiceNo)}</strong></div>
      <div>Date: ${escapeHtml(inv.date)}</div>
      <div>Customer: ${escapeHtml(inv.customer)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:60px">#</th>
        <th>Description</th>
        <th style="width:100px;text-align:center">Qty</th>
        <th style="width:140px;text-align:right">Rate</th>
        <th style="width:140px;text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
      <tr>
        <td colspan="3"></td>
        <td style="text-align:right;padding:8px;border:1px solid #ddd"><strong>Subtotal</strong></td>
        <td style="text-align:right;padding:8px;border:1px solid #ddd">${formatCurrency(
          subtotal
        )}</td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td style="text-align:right;padding:8px;border:1px solid #ddd"><strong>Tax</strong></td>
        <td style="text-align:right;padding:8px;border:1px solid #ddd">${formatCurrency(
          tax
        )}</td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td style="text-align:right;padding:8px;border:1px solid #ddd"><strong>Total</strong></td>
        <td style="text-align:right;padding:8px;border:1px solid #ddd">${formatCurrency(
          total
        )}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <div>GSTIN: __________________</div>
    <div style="margin-top:8px">Thank you for your business.</div>
  </div>

  <div class="no-print" style="margin-top:18px">
    <button onclick="window.print()" style="padding:10px 14px;background:#0b63d6;color:#fff;border:none;border-radius:6px;cursor:pointer">Print</button>
  </div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(html);
    win.document.close();
  };

  // small util to avoid injection in printed HTML
  function escapeHtml(str) {
    if (!str && str !== 0) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Billing</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setThemeDark((v) => !v)}
            className="px-3 py-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
            title="Toggle theme"
          >
            {themeDark ? "🌙 Dark" : "☀️ Light"}
          </button>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice no / customer..."
            className="border px-3 py-2 rounded w-full md:w-64 bg-white dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={openAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Add Invoice
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-gray-800">
        <table className="min-w-full">
          <thead className="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white">
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
                  className="border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{inv.invoiceNo}</td>
                  <td className="p-3">{inv.date}</td>
                  <td className="p-3">{inv.customer}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-white px-3 py-1 rounded-full text-sm ${
                        STATUS_COLORS[inv.status] || "bg-gray-500"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openEdit(inv)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handlePrint(inv.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded"
                    >
                      Print
                    </button>

                    <button
                      onClick={() => confirmDelete(inv.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="p-4 text-center text-gray-700 dark:text-gray-300"
                  colSpan={7}
                >
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl p-6 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Invoice" : "Add Invoice"}
              </h2>
              <button
                className="text-gray-600 dark:text-gray-300"
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="invoiceNo"
                  value={form.invoiceNo}
                  onChange={handleFormChange}
                  placeholder="Invoice No"
                  className="border p-2 rounded w-full bg-white dark:bg-gray-800 dark:text-white"
                  required
                />
                <input
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  type="date"
                  className="border p-2 rounded w-full bg-white dark:bg-gray-800 dark:text-white"
                  required
                />
                <input
                  name="customer"
                  value={form.customer}
                  onChange={handleFormChange}
                  placeholder="Customer Name"
                  className="border p-2 rounded w-full bg-white dark:bg-gray-800 dark:text-white"
                  required
                />
                <input
                  name="amount"
                  value={form.amount}
                  onChange={handleFormChange}
                  type="number"
                  placeholder="(Optional) amount — calculated from items if left blank"
                  className="border p-2 rounded w-full bg-white dark:bg-gray-800 dark:text-white"
                />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="border p-2 rounded w-full bg-white dark:bg-gray-800 dark:text-white"
                >
                  <option>Full Paid</option>
                  <option>UnPaid</option>
                  <option>Partial</option>
                </select>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium mb-2">Line Items</h3>
                <div className="space-y-2">
                  {form.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-6 gap-2 items-center"
                    >
                      <input
                        value={it.desc}
                        onChange={(e) =>
                          handleItemChange(idx, "desc", e.target.value)
                        }
                        placeholder="Description"
                        className="col-span-3 border p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
                        required
                      />
                      <input
                        value={it.qty}
                        onChange={(e) =>
                          handleItemChange(idx, "qty", e.target.value)
                        }
                        type="number"
                        min="1"
                        className="col-span-1 border p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
                        required
                      />
                      <input
                        value={it.rate}
                        onChange={(e) =>
                          handleItemChange(idx, "rate", e.target.value)
                        }
                        type="number"
                        min="0"
                        className="col-span-1 border p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
                        required
                      />
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="px-2 py-1 text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <div>
                    <button
                      type="button"
                      onClick={addItem}
                      className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingId ? "Update Invoice" : "Add Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId != null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 text-gray-900 dark:text-white">
            <h3 className="text-lg font-medium mb-2">Delete Invoice</h3>
            <p className="mb-4">
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </p>

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
