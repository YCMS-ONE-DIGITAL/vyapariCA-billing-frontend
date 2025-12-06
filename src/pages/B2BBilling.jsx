// B2BBilling.jsx
import React, { useState, useEffect } from "react";
import { Plus, X, Eye, Trash2 } from "lucide-react";

/**
 * Professional B2B Billing Page (Option B)
 *
 * - Modal for creating invoice (buyer details + items)
 * - GST calculation:
 *    - transactionType: "intra" => CGST + SGST (each = gst%/2)
 *    - transactionType: "inter" => IGST (full gst%)
 * - Saves invoices to localStorage key: "b2b_invoices"
 * - View Invoice modal with breakdown
 */

export default function B2BBilling() {
  const [invoiceList, setInvoiceList] = useState(() => {
    const raw = localStorage.getItem("b2b_invoices");
    return raw ? JSON.parse(raw) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  // Form state
  const [form, setForm] = useState({
    invoiceNo: "",
    date: "",
    businessName: "",
    gstNumber: "",
    billingAddress: "",
    transactionType: "intra", // "intra" or "inter"
  });

  const [items, setItems] = useState([
    { name: "", hsn: "", qty: 1, rate: 0, gst: 18 },
  ]);

  useEffect(() => {
    localStorage.setItem("b2b_invoices", JSON.stringify(invoiceList));
  }, [invoiceList]);

  // Item handlers
  const addItem = () =>
    setItems([...items, { name: "", hsn: "", qty: 1, rate: 0, gst: 18 }]);

  const removeItem = (idx) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, key, value) => {
    const copy = [...items];
    copy[idx][key] = value;
    setItems(copy);
  };

  // Calculations (per invoice)
  const calcItemTaxable = (it) => Number(it.qty || 0) * Number(it.rate || 0);

  const calcItemGSTAmount = (it, transactionType) => {
    const taxable = calcItemTaxable(it);
    const gstRate = Number(it.gst || 0);
    const gstAmount = (taxable * gstRate) / 100;
    // if intra -> split into CGST/SGST, else IGST
    if (transactionType === "intra") {
      return {
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        igst: 0,
        totalGst: gstAmount,
      };
    } else {
      return {
        cgst: 0,
        sgst: 0,
        igst: gstAmount,
        totalGst: gstAmount,
      };
    }
  };

  const calcInvoiceTotals = (itemsList, transactionType) => {
    let subtotal = 0;
    let totalGst = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    itemsList.forEach((it) => {
      const taxable = calcItemTaxable(it);
      const gst = calcItemGSTAmount(it, transactionType);
      subtotal += taxable;
      totalGst += gst.totalGst;
      totalCgst += gst.cgst;
      totalSgst += gst.sgst;
      totalIgst += gst.igst;
    });

    const grandTotal = subtotal + totalGst;
    return { subtotal, totalGst, totalCgst, totalSgst, totalIgst, grandTotal };
  };

  // Submit
  const submitInvoice = () => {
    // basic validation
    if (
      !form.invoiceNo ||
      !form.date ||
      !form.businessName ||
      !form.gstNumber
    ) {
      alert("Please fill Invoice No, Date, Business Name and GST Number.");
      return;
    }

    // ensure at least one valid item
    const validItems = items.filter((it) => it.name && it.qty > 0);
    if (validItems.length === 0) {
      alert("Please add at least one item with a name.");
      return;
    }

    const totals = calcInvoiceTotals(items, form.transactionType);

    const newInvoice = {
      id: Date.now(),
      ...form,
      items,
      totals,
    };

    setInvoiceList([newInvoice, ...invoiceList]);

    // reset form
    setForm({
      invoiceNo: "",
      date: "",
      businessName: "",
      gstNumber: "",
      billingAddress: "",
      transactionType: "intra",
    });
    setItems([{ name: "", hsn: "", qty: 1, rate: 0, gst: 18 }]);
    setShowModal(false);
  };

  const formatCurrency = (n) => `₹${Number(n || 0).toFixed(2)}`;

  // Delete invoice
  const deleteInvoice = (id) =>
    setInvoiceList((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="p-6 text-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-6">B2B Billing</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus size={16} /> Add B2B Invoice
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-200">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="p-3 text-left">Sr.No</th>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Buyer</th>
              <th className="p-3 text-left">GSTIN</th>
              <th className="p-3 text-right">SubTotal</th>
              <th className="p-3 text-right">GST</th>
              <th className="p-3 text-right">Grand Total</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoiceList.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-500">
                  No B2B invoices yet
                </td>
              </tr>
            ) : (
              invoiceList.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{inv.invoiceNo}</td>
                  <td className="p-3">{inv.date}</td>
                  <td className="p-3">{inv.businessName}</td>
                  <td className="p-3">{inv.gstNumber}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(inv.totals.subtotal)}
                  </td>
                  <td className="p-3 text-right">
                    {formatCurrency(inv.totals.totalGst)}
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {formatCurrency(inv.totals.grandTotal)}
                  </td>

                  <td className="p-3 text-center flex justify-center gap-3">
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Delete this invoice?"))
                          deleteInvoice(inv.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-700"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Create B2B Invoice</h2>

            {/* Buyer details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Invoice No"
                className="border p-3 rounded-lg"
                value={form.invoiceNo}
                onChange={(e) =>
                  setForm({ ...form, invoiceNo: e.target.value })
                }
              />

              <input
                type="date"
                className="border p-3 rounded-lg"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <input
                type="text"
                className="border p-3 rounded-lg col-span-2"
                placeholder="Buyer Business Name"
                value={form.businessName}
                onChange={(e) =>
                  setForm({ ...form, businessName: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Buyer GST Number"
                className="border p-3 rounded-lg"
                value={form.gstNumber}
                onChange={(e) =>
                  setForm({ ...form, gstNumber: e.target.value })
                }
              />

              <select
                value={form.transactionType}
                onChange={(e) =>
                  setForm({ ...form, transactionType: e.target.value })
                }
                className="border p-3 rounded-lg"
              >
                <option value="intra">Intra-state (CGST + SGST)</option>
                <option value="inter">Inter-state (IGST)</option>
              </select>

              <input
                type="text"
                placeholder="Billing Address"
                className="border p-3 rounded-lg"
                value={form.billingAddress}
                onChange={(e) =>
                  setForm({ ...form, billingAddress: e.target.value })
                }
              />
            </div>

            {/* Items */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Items</h3>

              <div className="space-y-3">
                {items.map((it, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Item Name"
                      className="col-span-4 border p-2 rounded-lg"
                      value={it.name}
                      onChange={(e) => updateItem(i, "name", e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="HSN"
                      className="col-span-2 border p-2 rounded-lg"
                      value={it.hsn}
                      onChange={(e) => updateItem(i, "hsn", e.target.value)}
                    />

                    <input
                      type="number"
                      min="1"
                      className="col-span-2 border p-2 rounded-lg"
                      value={it.qty}
                      onChange={(e) =>
                        updateItem(i, "qty", Number(e.target.value))
                      }
                    />

                    <input
                      type="number"
                      min="0"
                      className="col-span-2 border p-2 rounded-lg"
                      value={it.rate}
                      onChange={(e) =>
                        updateItem(i, "rate", Number(e.target.value))
                      }
                    />

                    <select
                      className="col-span-1 border p-2 rounded-lg"
                      value={it.gst}
                      onChange={(e) =>
                        updateItem(i, "gst", Number(e.target.value))
                      }
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>

                    <div className="col-span-1 text-center">
                      <button
                        className="text-red-600"
                        onClick={() => removeItem(i)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}

                <div>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>
              </div>
            </div>

            {/* Totals preview */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Preview Totals</h4>
              {(() => {
                const t = calcInvoiceTotals(items, form.transactionType);
                return (
                  <div className="grid grid-cols-2 gap-2">
                    <div>Subtotal:</div>
                    <div className="text-right">
                      {formatCurrency(t.subtotal)}
                    </div>

                    <div>Total GST:</div>
                    <div className="text-right">
                      {formatCurrency(t.totalGst)}
                    </div>

                    {form.transactionType === "intra" ? (
                      <>
                        <div>CGST:</div>
                        <div className="text-right">
                          {formatCurrency(t.totalCgst)}
                        </div>

                        <div>SGST:</div>
                        <div className="text-right">
                          {formatCurrency(t.totalSgst)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>IGST:</div>
                        <div className="text-right">
                          {formatCurrency(t.totalIgst)}
                        </div>
                      </>
                    )}

                    <div className="font-semibold">Grand Total:</div>
                    <div className="text-right font-semibold">
                      {formatCurrency(t.grandTotal)}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitInvoice}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW INVOICE MODAL */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setViewInvoice(null)}
              className="absolute top-4 right-4 text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-2">B2B Invoice</h2>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p>
                  <strong>Invoice:</strong> {viewInvoice.invoiceNo}
                </p>
                <p>
                  <strong>Date:</strong> {viewInvoice.date}
                </p>
                <p>
                  <strong>Buyer:</strong> {viewInvoice.businessName}
                </p>
                <p>
                  <strong>GSTIN:</strong> {viewInvoice.gstNumber}
                </p>
              </div>

              <div>
                <p>
                  <strong>Transaction:</strong>{" "}
                  {viewInvoice.transactionType === "intra"
                    ? "Intra-state"
                    : "Inter-state"}
                </p>
                <p>
                  <strong>Address:</strong> {viewInvoice.billingAddress || "-"}
                </p>
              </div>
            </div>

            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-left">HSN</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Taxable</th>
                  <th className="p-2 text-right">GST%</th>
                  <th className="p-2 text-right">GST Amt</th>
                </tr>
              </thead>

              <tbody>
                {viewInvoice.items.map((it, i) => {
                  const taxable = it.qty * it.rate;
                  const gstAmt = (taxable * it.gst) / 100;
                  return (
                    <tr key={i} className="border-b">
                      <td className="p-2">{it.name}</td>
                      <td className="p-2">{it.hsn || "-"}</td>
                      <td className="p-2 text-center">{it.qty}</td>
                      <td className="p-2 text-right">
                        ₹{Number(it.rate).toFixed(2)}
                      </td>
                      <td className="p-2 text-right">₹{taxable.toFixed(2)}</td>
                      <td className="p-2 text-right">{it.gst}%</td>
                      <td className="p-2 text-right">₹{gstAmt.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>Subtotal:</div>
              <div className="text-right">
                {formatCurrency(viewInvoice.totals.subtotal)}
              </div>

              <div>Total GST:</div>
              <div className="text-right">
                {formatCurrency(viewInvoice.totals.totalGst)}
              </div>

              {viewInvoice.transactionType === "intra" ? (
                <>
                  <div>CGST:</div>
                  <div className="text-right">
                    {formatCurrency(viewInvoice.totals.totalCgst)}
                  </div>

                  <div>SGST:</div>
                  <div className="text-right">
                    {formatCurrency(viewInvoice.totals.totalSgst)}
                  </div>
                </>
              ) : (
                <>
                  <div>IGST:</div>
                  <div className="text-right">
                    {formatCurrency(viewInvoice.totals.totalIgst)}
                  </div>
                </>
              )}

              <div className="font-semibold">Grand Total:</div>
              <div className="text-right font-semibold">
                {formatCurrency(viewInvoice.totals.grandTotal)}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
