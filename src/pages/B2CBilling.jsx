// B2CBillingPage.jsx
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Printer, X } from "lucide-react";

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

  // ---------------- EFFECT ----------------
  useEffect(() => {
    localStorage.setItem("b2c_invoices", JSON.stringify(invoiceList));
  }, [invoiceList]);

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
    setForm({
      ...form,
      items: [...form.items, { name: "", qty: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    if (form.items.length === 1) return;
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const updateItem = (index, key, value) => {
    const copy = [...form.items];
    copy[index][key] = value;
    setForm({ ...form, items: copy });
  };

  const calcTotal = () => {
    return form.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  };

  const saveInvoice = () => {
    if (!form.invoiceNo || !form.date || !form.customerName) {
      alert("Invoice No, Date, and Customer Name are required!");
      return;
    }

    if (editingInvoice) {
      setInvoiceList(
        invoiceList.map((inv) =>
          inv.id === editingInvoice ? { ...form, id: editingInvoice } : inv
        )
      );
    } else {
      setInvoiceList([...invoiceList, { ...form, id: Date.now() }]);
    }

    closeModal();
  };

  const deleteInvoice = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setInvoiceList(invoiceList.filter((inv) => inv.id !== id));
    }
  };

  const handlePrint = (inv) => {
    const itemsHtml = (inv.items || [])
      .map(
        (it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.name}</td>
        <td>${it.qty}</td>
        <td>${it.price}</td>
        <td>${it.qty * it.price}</td>
      </tr>`
      )
      .join("");

    const subtotal = inv.items.reduce((sum, i) => sum + i.qty * i.price, 0);

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; margin:0; padding:0;}
            table { width:100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 6px; text-align:center; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center">Vyapari CA - B2C Invoice</h2>
          <p><strong>Invoice:</strong> ${inv.invoiceNo}</p>
          <p><strong>Date:</strong> ${inv.date}</p>
          <p><strong>Customer:</strong> ${inv.customerName} (${inv.customerMobile})</p>
          <table>
            <thead>
              <tr>
                <th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <h3>Total: ₹${subtotal}</h3>
          <script>window.onload = () => window.print();</script>
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

      {/* Add Invoice Button */}
      <button
        onClick={() => openModal()}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
      >
        <Plus size={16} /> Add B2C Invoice
      </button>
      </div>

      {/* ---------------- TABLE ---------------- */}
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
                    {inv.items
                      .reduce((sum, i) => sum + i.qty * i.price, 0)
                      .toFixed(2)}
                  </td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handlePrint(inv)}
                    >
                      <Printer size={18} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openModal(inv)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteInvoice(inv.id)}
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

      {/* ---------------- MODAL ---------------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editingInvoice ? "Edit Invoice" : "Add Invoice"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Invoice No"
                className="border p-3 rounded-lg w-full"
                value={form.invoiceNo}
                onChange={(e) =>
                  setForm({ ...form, invoiceNo: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-3 rounded-lg w-full"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <input
                type="text"
                placeholder="Customer Name"
                className="border p-3 rounded-lg w-full"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Customer Mobile"
                className="border p-3 rounded-lg w-full"
                value={form.customerMobile}
                onChange={(e) =>
                  setForm({ ...form, customerMobile: e.target.value })
                }
              />
            </div>

            <h3 className="text-lg font-semibold mb-2">Items</h3>
            {form.items.map((it, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-3 mb-3 items-center"
              >
                <input
                  type="text"
                  placeholder="Item Name"
                  className="col-span-5 border p-2 rounded-lg"
                  value={it.name}
                  onChange={(e) => updateItem(i, "name", e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  className="col-span-2 border p-2 rounded-lg"
                  value={it.qty}
                  onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
                />
                <input
                  type="number"
                  min="0"
                  className="col-span-3 border p-2 rounded-lg"
                  value={it.price}
                  onChange={(e) =>
                    updateItem(i, "price", Number(e.target.value))
                  }
                />
                <button
                  className="col-span-2 text-red-600"
                  onClick={() => removeItem(i)}
                >
                  <Trash2 />
                </button>
              </div>
            ))}

            <button
              onClick={addItem}
              className="flex items-center gap-2 mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={18} /> Add Item
            </button>

            <h3 className="text-xl font-semibold mt-4">
              Total: ₹{calcTotal()}
            </h3>

            <button
              onClick={saveInvoice}
              className="w-full bg-green-600 text-white py-3 mt-4 rounded-lg text-lg"
            >
              {editingInvoice ? "Update Invoice" : "Save Invoice"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
