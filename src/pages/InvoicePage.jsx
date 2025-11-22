import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

// LocalStorage keys
const LS_INVOICES = "vyapari_invoices_v1";
const LS_CLIENTS = "vyapari_clients_v1";

// currency formatting
function formatCurrency(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

export default function InvoicePage() {
  // Load invoices
  const [invoices, setInvoices] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_INVOICES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Load clients
  const [clients, setClients] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_CLIENTS);
      return raw
        ? JSON.parse(raw)
        : [
            { id: 1, name: "Rahul Sharma" },
            { id: 2, name: "Priya Patel" },
            { id: 3, name: "Amit Enterprises" },
          ];
    } catch {
      return [];
    }
  });

  // persist
  useEffect(() => {
    localStorage.setItem(LS_INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(LS_CLIENTS, JSON.stringify(clients));
  }, [clients]);

  // UI states
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // empty form state
  const emptyForm = {
    invoiceNo: "",
    invoiceDate: "",
    dueDate: "",
    customerId: "",
    customerName: "",
    gstPercent: 18,
    items: [{ desc: "", qty: 1, rate: 0 }],
    status: "UnPaid",
  };

  const [form, setForm] = useState(emptyForm);

  // calculations
  const calcSubtotal = (items = []) =>
    items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.rate || 0), 0);

  const calcGST = (subtotal, gstPct) =>
    (Number(subtotal) * Number(gstPct || 0)) / 100;

  const calcTotal = (subtotal, gstPct) => subtotal + calcGST(subtotal, gstPct);

  // filtering
  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNo?.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerName || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // open Add modal
  function openAddModal() {
    setForm({
      ...emptyForm,
      invoiceNo: generateInvoiceNo(),
      invoiceDate: new Date().toISOString().slice(0, 10),
    });
    setEditingId(null);
    setIsModalOpen(true);
  }

  // invoice number generator
  function generateInvoiceNo() {
    const id = invoices.length ? Math.max(...invoices.map((i) => i.id)) + 1 : 1;
    return `INV-${String(id).padStart(4, "0")}`;
  }

  // open Edit modal
  function openEditModal(inv) {
    setEditingId(inv.id);
    setForm({
      invoiceNo: inv.invoiceNo || "",
      invoiceDate: inv.invoiceDate || "",
      dueDate: inv.dueDate || "",
      customerId: inv.customerId || "",
      customerName: inv.customerName || "",
      gstPercent: inv.gstPercent ?? 18,
      items: inv.items || [{ desc: "", qty: 1, rate: 0 }],
      status: inv.status || "UnPaid",
    });
    setIsModalOpen(true);
  }

  // update helpers
  const updateFormField = (key, value) =>
    setForm((s) => ({ ...s, [key]: value }));

  const updateItem = (idx, key, value) =>
    setForm((s) => ({
      ...s,
      items: s.items.map((it, i) =>
        i === idx
          ? {
              ...it,
              [key]: key === "qty" || key === "rate" ? Number(value) : value,
            }
          : it
      ),
    }));

  const addItem = () =>
    setForm((s) => ({
      ...s,
      items: [...s.items, { desc: "", qty: 1, rate: 0 }],
    }));

  const removeItem = (idx) =>
    setForm((s) => ({
      ...s,
      items: s.items.filter((_, i) => i !== idx),
    }));

  // customer dropdown
  function onSelectCustomer(id) {
    const c = clients.find((x) => String(x.id) === String(id));
    setForm((s) => ({ ...s, customerId: id, customerName: c ? c.name : "" }));
  }

  // add new customer
  function addClient(name) {
    const newId = clients.length
      ? Math.max(...clients.map((c) => c.id)) + 1
      : 1;

    const newClient = { id: newId, name: name.trim() };
    setClients([...clients, newClient]);
    return newClient;
  }

  // save invoice
  function handleSaveInvoice() {
    const subtotal = calcSubtotal(form.items);
    const amount = calcTotal(subtotal, form.gstPercent);

    if (editingId) {
      setInvoices((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form, amount } : p))
      );
    } else {
      const newId = invoices.length
        ? Math.max(...invoices.map((i) => i.id)) + 1
        : 1;

      setInvoices([...invoices, { id: newId, ...form, amount }]);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  // delete invoice
  function confirmDelete(id) {
    setToDeleteId(id);
    setIsDeleteOpen(true);
  }

  function doDelete() {
    setInvoices(invoices.filter((i) => i.id !== toDeleteId));
    setIsDeleteOpen(false);
    setToDeleteId(null);
  }

  // escape HTML
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // Print Invoice
  function openPrintWindow(inv) {
    const subtotal = calcSubtotal(inv.items || []);
    const gst = calcGST(subtotal, inv.gstPercent);
    const total = calcTotal(subtotal, inv.gstPercent);

    const itemsHtml = inv.items
      .map(
        (it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(it.desc)}</td>
        <td>${it.qty}</td>
        <td>${formatCurrency(it.rate)}</td>
        <td>${formatCurrency(it.qty * it.rate)}</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <html><head><title>Invoice</title></head>
      <body>
        <h2>Invoice</h2>
        <p><b>No:</b> ${inv.invoiceNo}</p>
        <p><b>Date:</b> ${inv.invoiceDate}</p>
        <p><b>Customer:</b> ${inv.customerName}</p>

        <table border="1" width="100%" style="border-collapse:collapse;margin-top:10px">
          <tr>
            <th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Total</th>
          </tr>
          ${itemsHtml}
          <tr><td colspan="4">Subtotal</td><td>${formatCurrency(
            subtotal
          )}</td></tr>
          <tr><td colspan="4">GST</td><td>${formatCurrency(gst)}</td></tr>
          <tr><td colspan="4"><b>Total</b></td><td><b>${formatCurrency(
            total
          )}</b></td></tr>
        </table>

        <button onclick="window.print()" style="margin-top:15px">Print</button>
      </body>
      </html>
    `;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }

  // page navigation
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // totals for preview
  const formSubtotal = calcSubtotal(form.items);
  const formGST = calcGST(formSubtotal, form.gstPercent);
  const formTotal = calcTotal(formSubtotal, form.gstPercent);

  // UI START
  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoices</h1>

        <div className="flex gap-3">
          <input
            placeholder="Search invoice..."
            className="border rounded px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            <Plus className="w-4 h-4 inline" /> Add Invoice
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Sr</th>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              paged.map((inv, i) => (
                <tr key={inv.id} className="border-b">
                  <td className="p-3">{(page - 1) * pageSize + i + 1}</td>
                  <td className="p-3 font-semibold">{inv.invoiceNo}</td>
                  <td className="p-3">{inv.invoiceDate}</td>
                  <td className="p-3">{inv.customerName}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(inv.amount)}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded text-xs ${
                        inv.status === "Full Paid"
                          ? "bg-green-200 text-green-700"
                          : inv.status === "UnPaid"
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-200 text-yellow-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(inv)}
                        className="text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openPrintWindow(inv)}
                        className="text-green-600"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => confirmDelete(inv.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-3 flex justify-between items-center bg-gray-50 border-t">
          <span>
            Showing {(page - 1) * pageSize + 1} –{" "}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>

          <div className="flex gap-2">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 border rounded">
              Page {page} / {totalPages}
            </span>

            <button
              onClick={goNext}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-3xl rounded-lg p-5 shadow-lg max-h-[90vh] overflow-auto"
          >
            <h2 className="text-xl font-bold mb-3">
              {editingId ? "Edit Invoice" : "New Invoice"}
            </h2>

            {/* FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveInvoice();
              }}
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="border p-2 rounded"
                  value={form.invoiceNo}
                  onChange={(e) => updateFormField("invoiceNo", e.target.value)}
                  required
                />
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={form.invoiceDate}
                  onChange={(e) =>
                    updateFormField("invoiceDate", e.target.value)
                  }
                  required
                />
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={form.dueDate}
                  onChange={(e) => updateFormField("dueDate", e.target.value)}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="text-sm">Customer</label>
                  <div className="flex gap-2">
                    <select
                      className="border p-2 rounded w-full"
                      value={form.customerId}
                      onChange={(e) => onSelectCustomer(e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const name = prompt("Enter new customer name:");
                        if (name) {
                          const c = addClient(name);
                          updateFormField("customerId", c.id);
                          updateFormField("customerName", c.name);
                        }
                      }}
                      className="px-3 py-2 bg-gray-100 rounded"
                    >
                      + Add
                    </button>
                  </div>

                  <input
                    className="border p-2 rounded mt-2 w-full"
                    value={form.customerName}
                    onChange={(e) =>
                      updateFormField("customerName", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="text-sm">GST %</label>
                  <input
                    type="number"
                    className="border p-2 rounded w-full"
                    value={form.gstPercent}
                    onChange={(e) =>
                      updateFormField("gstPercent", Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm">Status</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={form.status}
                    onChange={(e) => updateFormField("status", e.target.value)}
                  >
                    <option>Full Paid</option>
                    <option>UnPaid</option>
                    <option>Partial</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 bg-gray-100 rounded"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {form.items.map((it, idx) => (
                    <div className="grid grid-cols-12 gap-2">
                      <input
                        className="col-span-6 border p-2 rounded"
                        value={it.desc}
                        onChange={(e) =>
                          updateItem(idx, "desc", e.target.value)
                        }
                        placeholder="Description"
                      />
                      <input
                        type="number"
                        className="col-span-2 border p-2 rounded"
                        value={it.qty}
                        onChange={(e) =>
                          updateItem(idx, "qty", Number(e.target.value))
                        }
                      />
                      <input
                        type="number"
                        className="col-span-2 border p-2 rounded"
                        value={it.rate}
                        onChange={(e) =>
                          updateItem(idx, "rate", Number(e.target.value))
                        }
                      />
                      <div className="col-span-1 text-right pt-2">
                        {formatCurrency(it.qty * it.rate)}
                      </div>
                      <button
                        type="button"
                        className="col-span-1 text-red-600"
                        onClick={() => removeItem(idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="bg-gray-50 w-64 p-3 rounded">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(formSubtotal)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>GST</span>
                    <span>{formatCurrency(formGST)}</span>
                  </div>
                  <div className="flex justify-between mt-2 font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(formTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setForm(emptyForm);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save Invoice
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow w-80">
            <h3 className="text-lg font-bold">Delete Invoice?</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this invoice?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={doDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
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
