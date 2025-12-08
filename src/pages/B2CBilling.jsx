// B2CBillingPage.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Printer,
  X,
  FileJson,
  FileSpreadsheet,
} from "lucide-react";

export default function B2CBillingPage() {
  // ---------------- STATE ----------------
  const [invoiceList, setInvoiceList] = useState(() => {
    const raw = localStorage.getItem("b2c_invoices");
    return raw ? JSON.parse(raw) : [];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [form, setForm] = useState({
    invoiceNo: "",
    date: "",
    customerName: "",
    customerMobile: "",
    items: [{ name: "", qty: 1, price: 0 }],
  });

  // persist
  useEffect(() => {
    localStorage.setItem("b2c_invoices", JSON.stringify(invoiceList));
  }, [invoiceList]);

  // ---------------- HELPERS / CALCS ----------------
  const calcRowTotal = (it) => {
    const qty = Number(it.qty || 0);
    const price = Number(it.price || 0);
    return qty * price;
  };

  const calcTotal = () =>
    form.items.reduce((sum, i) => sum + calcRowTotal(i), 0);

  // ---------------- HANDLERS ----------------
  const openModal = (invoice = null) => {
    if (invoice) {
      setForm(invoice);
      setEditingInvoice(invoice.id);
    } else {
      setForm({
        invoiceNo: "",
        date: "",
        customerName: "",
        customerMobile: "",
        items: [{ name: "", qty: 1, price: 0 }],
      });
      setEditingInvoice(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", qty: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (form.items.length === 1) return;
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const updateItem = (index, key, value) => {
    const copy = [...form.items];
    if (key === "qty" || key === "price") {
      // allow empty string to enable clearing the field while typing
      copy[index][key] = value === "" ? "" : Number(value);
    } else {
      copy[index][key] = value;
    }
    setForm({ ...form, items: copy });
  };

  const saveInvoice = () => {
    if (!form.invoiceNo || !form.date || !form.customerName) {
      alert("Invoice No, Date, and Customer Name are required!");
      return;
    }

    // ensure at least one valid item with name and qty>0
    const validItems = form.items.filter((it) => it.name && Number(it.qty) > 0);
    if (validItems.length === 0) {
      alert("Please add at least one item with a name and quantity > 0.");
      return;
    }

    const invoiceData = {
      ...form,
      totals: {
        total: calcTotal(),
      },
    };

    if (editingInvoice) {
      setInvoiceList((prev) =>
        prev.map((inv) =>
          inv.id === editingInvoice
            ? { ...invoiceData, id: editingInvoice }
            : inv
        )
      );
    } else {
      setInvoiceList((prev) => [{ ...invoiceData, id: Date.now() }, ...prev]);
    }

    closeModal();
  };

  const deleteInvoice = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setInvoiceList((prev) => prev.filter((inv) => inv.id !== id));
    }
  };

  // ---------------- EXPORT / PRINT ----------------
  const downloadJSON = (inv) => {
    const blob = new Blob([JSON.stringify(inv, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${inv.invoiceNo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcel = (inv) => {
    let csv = "Item,Qty,Price,Total\n";
    inv.items.forEach((i) => {
      csv += `"${i.name}",${i.qty},${i.price},${(
        Number(i.qty || 0) * Number(i.price || 0)
      ).toFixed(2)}\n`;
    });
    csv += `\nTotal,,,"${
      (inv.totals && inv.totals.total) ||
      inv.items.reduce(
        (s, it) => s + Number(it.qty || 0) * Number(it.price || 0),
        0
      )
    }"`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${inv.invoiceNo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (inv) => {
    const itemsHtml = (inv.items || [])
      .map((it, idx) => {
        const total = (Number(it.qty || 0) * Number(it.price || 0)).toFixed(2);
        return `<tr>
          <td style="padding:6px;border:1px solid #000;text-align:center">${
            idx + 1
          }</td>
          <td style="padding:6px;border:1px solid #000;text-align:left">${
            it.name
          }</td>
          <td style="padding:6px;border:1px solid #000;text-align:center">${
            it.qty
          }</td>
          <td style="padding:6px;border:1px solid #000;text-align:right">${
            it.price
          }</td>
          <td style="padding:6px;border:1px solid #000;text-align:right">${total}</td>
        </tr>`;
      })
      .join("");

    const subtotal = (inv.items || [])
      .reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0)
      .toFixed(2);

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; margin: 20px; }
            table { width:100%; border-collapse: collapse; margin-top:10px; }
            th, td { border:1px solid #000; padding:6px; }
            th { background:#f0f0f0; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center">Vyapari CA - B2C Invoice</h2>
          <p><strong>Invoice:</strong> ${
            inv.invoiceNo
          } &nbsp;&nbsp; <strong>Date:</strong> ${inv.date}</p>
          <p><strong>Customer:</strong> ${inv.customerName} ${
      inv.customerMobile ? `(${inv.customerMobile})` : ""
    }</p>
          <table>
            <thead>
              <tr><th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <h3 style="text-align:right">Total: ₹${subtotal}</h3>
          <script>window.onload = ()=>window.print()</script>
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  // ---------------- RENDER ----------------
  return (
    <div className="p-6 text-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-6">B2C Billing</h1>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus size={16} /> Add B2C Invoice
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-200">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="p-3 text-left">Sr.No</th>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoiceList.length ? (
              invoiceList.map((inv, idx) => (
                <tr key={inv.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{inv.invoiceNo}</td>
                  <td className="p-3">{inv.date}</td>
                  <td className="p-3">{inv.customerName}</td>
                  <td className="p-3 text-center font-semibold">
                    ₹
                    {(inv.items || [])
                      .reduce(
                        (s, it) =>
                          s + Number(it.qty || 0) * Number(it.price || 0),
                        0
                      )
                      .toFixed(2)}
                  </td>

                  <td className="p-3 text-center flex justify-center gap-4">
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => downloadJSON(inv)}
                      title="Export JSON"
                    >
                      <FileJson size={18} />
                    </button>

                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => downloadExcel(inv)}
                      title="Export Excel"
                    >
                      <FileSpreadsheet size={18} />
                    </button>

                    <button
                      className="text-black hover:text-gray-700"
                      onClick={() => handlePrint(inv)}
                      title="Print"
                    >
                      <Printer size={18} />
                    </button>

                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openModal(inv)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteInvoice(inv.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL - FULL SCREEN CENTERED */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-[1100px] h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                {editingInvoice ? "Edit Invoice" : "Create B2C Invoice"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Section: Invoice / Customer (border box) */}
              <div className="border rounded-lg p-4 mb-6 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice No *
                    </label>
                    <input
                      type="text"
                      placeholder="Invoice No"
                      value={form.invoiceNo}
                      onChange={(e) =>
                        setForm({ ...form, invoiceNo: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={form.customerName}
                      onChange={(e) =>
                        setForm({ ...form, customerName: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="Customer Mobile"
                      value={form.customerMobile}
                      onChange={(e) =>
                        setForm({ ...form, customerMobile: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Items (border box) */}
              <div className="border rounded-lg p-4 mb-6 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                {/* POS-style item rows */}
                <div className="space-y-3">
                  {form.items.map((it, idx) => {
                    const rowTotal = calcRowTotal(it);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 rounded border"
                      >
                        {/* Item name (flex-grow) */}
                        <input
                          type="text"
                          placeholder="Item name"
                          value={it.name}
                          onChange={(e) =>
                            updateItem(idx, "name", e.target.value)
                          }
                          className="flex-1 border rounded px-3 py-2"
                        />

                        {/* Qty */}
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 hidden sm:block">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={it.qty}
                            onChange={(e) =>
                              updateItem(
                                idx,
                                "qty",
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                            className="w-20 border rounded px-2 py-2 text-right"
                          />
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 hidden sm:block">
                            Price
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={it.price}
                            onChange={(e) =>
                              updateItem(
                                idx,
                                "price",
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                            className="w-28 border rounded px-2 py-2 text-right"
                          />
                        </div>

                        {/* Row total (display only) */}
                        <div className="flex items-center gap-2 ml-auto">
                          <div className="text-sm text-gray-600 hidden sm:block">
                            Total
                          </div>
                          <div className="font-medium">
                            ₹{rowTotal.toFixed(2)}
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(idx)}
                            className="text-red-600 hover:text-red-800 ml-2"
                            title="Remove"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section: Totals (border box) */}
              <div className="border rounded-lg p-4 mb-6 bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold">Total</h4>
                    <p className="text-sm text-gray-600">
                      Auto calculated from items
                    </p>
                  </div>

                  <div className="text-2xl font-bold">
                    ₹{calcTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4 border-t bg-white flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveInvoice}
                className="px-6 py-2 bg-green-600 text-white rounded"
              >
                {editingInvoice ? "Update Invoice" : "Save Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
