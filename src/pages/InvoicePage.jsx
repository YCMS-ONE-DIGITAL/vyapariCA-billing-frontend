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

/**
 * InvoicePage.jsx
 * - Add/Edit modal with blur backdrop
 * - Item list (desc, qty, rate) -> subtotal / gst / total calculations
 * - Customer dropdown autofill + add new customer
 * - Print invoice template (print window) -> also used for "Save as PDF"
 * - Pagination
 * - Delete confirmation modal
 * - Data persisted to localStorage
 *
 * Tailwind required.
 */

// LocalStorage keys
const LS_INVOICES = "vyapari_invoices_v1";
const LS_CLIENTS = "vyapari_clients_v1";

function formatCurrency(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

export default function InvoicePage() {
  // --- Data (load from storage)
  const [invoices, setInvoices] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_INVOICES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

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

  // --- UI state
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // add/edit modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // delete confirm
  const [toDeleteId, setToDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null); // if editing, invoice id

  // --- Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8; // rows per page

  // --- Form state
  const emptyForm = {
    invoiceNo: "",
    invoiceDate: "",
    dueDate: "",
    customerId: "", // link to clients
    customerName: "",
    gstPercent: 18,
    items: [{ desc: "", qty: 1, rate: 0 }],
    status: "UnPaid",
  };
  const [form, setForm] = useState(emptyForm);

  // helper calculations
  const calcSubtotal = (items = []) =>
    items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.rate || 0), 0);

  const calcGST = (subtotal, gstPct) =>
    (Number(subtotal) * Number(gstPct || 0)) / 100;
  const calcTotal = (subtotal, gstPct) => subtotal + calcGST(subtotal, gstPct);

  // --- filtered invoices
  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNo?.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerName || "").toLowerCase().includes(search.toLowerCase())
  );

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line
  }, [filtered.length, totalPages]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // --- Modal open for Add
  function openAddModal() {
    setForm({
      ...emptyForm,
      invoiceNo: generateInvoiceNo(),
      invoiceDate: new Date().toISOString().slice(0, 10),
    });
    setEditingId(null);
    setIsModalOpen(true);
  }

  // generate invoice no simple
  function generateInvoiceNo() {
    const id = invoices.length ? Math.max(...invoices.map((i) => i.id)) + 1 : 1;
    return `INV-${String(id).padStart(4, "0")}`;
  }

  // --- Modal open for Edit
  function openEditModal(inv) {
    setEditingId(inv.id);
    setForm({
      invoiceNo: inv.invoiceNo || "",
      invoiceDate: inv.invoiceDate || "",
      dueDate: inv.dueDate || "",
      customerId: inv.customerId || "",
      customerName: inv.customerName || "",
      gstPercent: inv.gstPercent ?? 18,
      items: inv.items?.map((it) => ({ ...it })) || [
        { desc: "", qty: 1, rate: 0 },
      ],
      status: inv.status || "UnPaid",
    });
    setIsModalOpen(true);
  }

  // --- Form helpers
  const updateFormField = (key, value) =>
    setForm((s) => ({ ...s, [key]: value }));

  const updateItem = (idx, key, value) =>
    setForm((s) => {
      const items = s.items.map((it, i) =>
        i === idx
          ? {
              ...it,
              [key]: key === "qty" || key === "rate" ? Number(value) : value,
            }
          : it
      );
      return { ...s, items };
    });

  const addItem = () =>
    setForm((s) => ({
      ...s,
      items: [...s.items, { desc: "", qty: 1, rate: 0 }],
    }));
  const removeItem = (idx) =>
    setForm((s) => ({ ...s, items: s.items.filter((_, i) => i !== idx) }));

  // when customer selected
  function onSelectCustomer(id) {
    const c = clients.find((x) => String(x.id) === String(id));
    setForm((s) => ({ ...s, customerId: id, customerName: c ? c.name : "" }));
  }

  // add new client inline
  function addClient(name) {
    if (!name || !name.trim()) return;
    const newId = clients.length
      ? Math.max(...clients.map((c) => c.id)) + 1
      : 1;
    const newClient = { id: newId, name: name.trim() };
    setClients((prev) => [...prev, newClient]);
    return newClient;
  }

  // --- Save (add or update)
  function handleSaveInvoice(e) {
    e?.preventDefault?.();
    // In a real app, use a custom modal instead of alert
    if (!form.invoiceNo || !form.invoiceDate || !form.customerName) {
      console.error("Invoice No, Date and Customer are required.");
      return;
    }

    const subtotal = calcSubtotal(form.items || []);
    const amount = calcTotal(subtotal, form.gstPercent);

    if (editingId) {
      setInvoices((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form, amount } : p))
      );
    } else {
      const newId = invoices.length
        ? Math.max(...invoices.map((i) => i.id)) + 1
        : 1;
      setInvoices((prev) => [...prev, { id: newId, ...form, amount }]);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  // --- Delete flow with confirm modal
  function confirmDelete(id) {
    setToDeleteId(id);
    setIsDeleteOpen(true);
  }
  function doDelete() {
    if (toDeleteId == null) return;
    setInvoices((prev) => prev.filter((i) => i.id !== toDeleteId));
    setIsDeleteOpen(false);
    setToDeleteId(null);
  }

  // --- Print / Download (open printable window)
  function openPrintWindow(inv) {
    const subtotal = calcSubtotal(inv.items || []);
    const gst = calcGST(subtotal, inv.gstPercent);
    const total = calcTotal(subtotal, inv.gstPercent);

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

    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Invoice ${escapeHtml(
      inv.invoiceNo
    )}</title>
    <style>
      body{font-family:Arial,sans-serif;color:#222;padding:20px}
      .top{display:flex;justify-content:space-between;align-items:flex-start}
      .brand{font-weight:800;color:#0b63d6;font-size:22px}
      table{width:100%;border-collapse:collapse;margin-top:18px}
      th{background:#0b63d6;color:#fff;padding:10px;text-align:left}
      td{padding:8px;border:1px solid #ddd}
      .right{text-align:right}
      @media print {.no-print{display:none}}
    </style>
    </head><body>
    <div class="top">
      <div>
        <div class="brand">Vyapari CA</div>
        <div style="margin-top:6px;color:#444">CA & Business Management Suite</div>
        <div style="color:#444;margin-top:6px">Address: Your business address here</div>
      </div>
      <div style="text-align:right;color:#333">
        <div style="font-weight:700">Invoice</div>
        <div>Invoice No: <strong>${escapeHtml(inv.invoiceNo)}</strong></div>
        <div>Date: ${escapeHtml(inv.invoiceDate)}</div>
        <div>Due: ${escapeHtml(inv.dueDate || "")}</div>
        <div>Customer: ${escapeHtml(inv.customerName)}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr><th style="width:5%">#</th><th style="width:55%">Description</th><th style="width:10%">Qty</th><th style="width:15%">Rate</th><th style="width:15%">Amount</th></tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td colspan="3" style="border:none"></td>
          <td style="text-align:right;padding:8px;border:1px solid #ddd"><strong>Subtotal</strong></td>
          <td style="text-align:right;padding:8px;border:1px solid #ddd">${formatCurrency(
            subtotal
          )}</td>
        </tr>
        <tr>
          <td colspan="3" style="border:none"></td>
          <td style="text-align:right;padding:8px;border:1px solid #ddd"><strong>GST (${escapeHtml(
            String(inv.gstPercent || 0)
          )}%)</strong></td>
          <td style="text-align:right;padding:8px;border:1px solid #ddd">${formatCurrency(
            gst
          )}</td>
        </tr>
        <tr>
          <td colspan="3" style="border:none"></td>
          <td style="text-align:right;padding:8px;border:1px solid #ddd"><strong>Total</strong></td>
          <td style="text-align:right;padding:8px;border:1px solid #ddd">${formatCurrency(
            total
          )}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top:18px;color:#444">GSTIN: __________________</div>

    <div class="no-print" style="margin-top:18px">
      <button onclick="window.print()" style="padding:10px 14px;background:#0b63d6;color:#fff;border:none;border-radius:6px;cursor:pointer">Print / Save as PDF</button>
    </div>

    </body></html>`;

    const w = window.open("", "_blank", "width=900,height=700");
    w.document.write(html);
    w.document.close();
  }

  // escape helper
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // simple UI functions for prev/next page
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // total calculations for form live preview
  const formSubtotal = calcSubtotal(form.items);
  const formGST = calcGST(formSubtotal, form.gstPercent);
  const formTotal = calcTotal(formSubtotal, form.gstPercent);

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-gray-600">
            Manage invoices — add, edit, print and download
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-white border rounded p-2 shadow-sm w-full sm:w-auto">
            <input
              placeholder="Search invoice no or customer..."
              className="outline-none w-full sm:w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
          >
            <Plus className="w-4 h-4" /> Add Invoice
          </button>
        </div>
      </div>

      {/* table container */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-3">Sr.No</th>
                <th className="p-3">Invoice No</th>
                <th className="p-3">Invoice Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                paged.map((inv, idx) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 align-top">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td className="p-3 font-semibold align-top">
                      {inv.invoiceNo}
                    </td>
                    <td className="p-3 align-top">{inv.invoiceDate}</td>
                    <td className="p-3 align-top">{inv.customerName}</td>
                    <td className="p-3 text-right font-semibold align-top">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="p-3 align-top">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          inv.status === "Full Paid" || inv.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "UnPaid" || inv.status === "Unpaid"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-center align-top flex items-center justify-center gap-2">
                      <button
                        title="Edit"
                        onClick={() => openEditModal(inv)}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        title="Print"
                        onClick={() => openPrintWindow(inv)}
                        className="text-green-600 hover:text-green-800 p-2 rounded"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => confirmDelete(inv.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className="p-2 rounded border disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 border rounded">
              Page {page} / {totalPages}
            </div>
            <button
              onClick={goNext}
              disabled={page === totalPages}
              className="p-2 rounded border disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL (with backdrop blur) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-3">
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-auto max-h-[90vh] p-5"
          >
            {/* INVOICE TITLE (Moved up and styled) */}
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              {editingId ? "Edit Invoice" : "Add New Invoice"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveInvoice();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="border p-2 rounded"
                  placeholder="Invoice No"
                  value={form.invoiceNo}
                  onChange={(e) => updateFormField("invoiceNo", e.target.value)}
                  required
                />
                <input
                  className="border p-2 rounded"
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) =>
                    updateFormField("invoiceDate", e.target.value)
                  }
                  required
                />
                <input
                  className="border p-2 rounded"
                  type="date"
                  placeholder="Due Date"
                  value={form.dueDate}
                  onChange={(e) => updateFormField("dueDate", e.target.value)}
                />
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Customer</label>
                  <div className="flex gap-2 mt-1">
                    <select
                      value={form.customerId}
                      onChange={(e) => {
                        onSelectCustomer(e.target.value);
                      }}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">-- Select Customer --</option>
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
                        if (name && name.trim()) {
                          const c = addClient(name.trim());
                          // set selected
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
                    placeholder="Customer Name (auto-fill or edit)"
                    value={form.customerName}
                    onChange={(e) =>
                      updateFormField("customerName", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">GST %</label>
                  <input
                    type="number"
                    min="0"
                    className="border p-2 rounded w-full mt-1"
                    value={form.gstPercent}
                    onChange={(e) =>
                      updateFormField("gstPercent", Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Payment Status
                  </label>
                  <select
                    className="border p-2 rounded w-full mt-1"
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
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Line Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 bg-gray-100 rounded"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {form.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <input
                        className="col-span-6 border p-2 rounded"
                        placeholder="Description"
                        value={it.desc}
                        onChange={(e) =>
                          updateItem(idx, "desc", e.target.value)
                        }
                        required
                      />
                      <input
                        type="number"
                        min="1"
                        className="col-span-2 border p-2 rounded"
                        value={it.qty}
                        onChange={(e) =>
                          updateItem(idx, "qty", Number(e.target.value))
                        }
                        required
                      />
                      <input
                        type="number"
                        min="0"
                        className="col-span-2 border p-2 rounded"
                        value={it.rate}
                        onChange={(e) =>
                          updateItem(idx, "rate", Number(e.target.value))
                        }
                        required
                      />
                      <div className="col-span-1 text-right">
                        {formatCurrency(it.qty * it.rate)}
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* totals preview */}
              <div className="mt-4 flex justify-end">
                <div className="w-full sm:w-80 bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                    <div>Subtotal</div>
                    <div>{formatCurrency(formSubtotal)}</div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <div>GST ({form.gstPercent}%)</div>
                    <div>{formatCurrency(formGST)}</div>
                  </div>
                  <div className="flex justify-between mt-2 font-semibold text-lg">
                    <div>Total</div>
                    <div>{formatCurrency(formTotal)}</div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (Moved to the bottom) */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-md transition duration-150"
                >
                  {editingId ? "Update Invoice" : "Save Invoice"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-3">
          <div className="bg-white rounded-xl p-5 shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Delete Invoice</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-3 py-2 border rounded"
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
