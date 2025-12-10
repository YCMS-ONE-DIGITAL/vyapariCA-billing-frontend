// B2BBilling.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Eye,
  Trash2,
  Edit,
  FileJson,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

/**
 * B2B Billing Page — Full Screen Modals (Option B)
 * Added: JSON & Excel export icons (before Eye) + download handlers
 * Additional: Download ALL invoices as single JSON or single CSV (Excel) file
 */

export default function B2BBilling() {
  const [invoiceList, setInvoiceList] = useState(() => {
    const raw = localStorage.getItem("b2b_invoices");
    return raw ? JSON.parse(raw) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [editingId, setEditingId] = useState(null);

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
    // ensure numeric conversions where necessary
    if (key === "qty" || key === "rate" || key === "gst") {
      copy[idx][key] = value === "" ? "" : Number(value);
    } else {
      copy[idx][key] = value;
    }
    setItems(copy);
  };

  // Calculations (per invoice)
  const calcItemTaxable = (it) => {
    const qty = Number(it.qty || 0);
    const rate = Number(it.rate || 0);
    return qty * rate;
  };

  const calcItemGSTAmount = (it, transactionType) => {
    const taxable = calcItemTaxable(it);
    const gstRate = Number(it.gst || 0);
    const gstAmount = (taxable * gstRate) / 100;
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

  const formatCurrency = (n) => `₹${Number(n || 0).toFixed(2)}`;

  // Create / Edit modal opener
  const openModal = (invoice = null) => {
    if (invoice) {
      // Edit mode
      setForm({
        invoiceNo: invoice.invoiceNo || "",
        date: invoice.date || "",
        businessName: invoice.businessName || "",
        gstNumber: invoice.gstNumber || "",
        billingAddress: invoice.billingAddress || "",
        transactionType: invoice.transactionType || "intra",
      });
      setItems(
        invoice.items && invoice.items.length
          ? invoice.items
          : [{ name: "", hsn: "", qty: 1, rate: 0, gst: 18 }]
      );
      setEditingId(invoice.id);
    } else {
      // New
      setForm({
        invoiceNo: "",
        date: "",
        businessName: "",
        gstNumber: "",
        billingAddress: "",
        transactionType: "intra",
      });
      setItems([{ name: "", hsn: "", qty: 1, rate: 0, gst: 18 }]);
      setEditingId(null);
    }
    setShowModal(true);
  };

  // Submit (create/update)
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

    const validItems = items.filter((it) => it.name && Number(it.qty) > 0);
    if (validItems.length === 0) {
      alert("Please add at least one item with a name and qty > 0.");
      return;
    }

    const totals = calcInvoiceTotals(items, form.transactionType);

    if (editingId) {
      setInvoiceList((prev) =>
        prev.map((inv) =>
          inv.id === editingId ? { ...inv, ...form, items, totals } : inv
        )
      );
    } else {
      const newInvoice = {
        id: Date.now(),
        ...form,
        items,
        totals,
      };
      setInvoiceList([newInvoice, ...invoiceList]);
    }

    // reset
    setForm({
      invoiceNo: "",
      date: "",
      businessName: "",
      gstNumber: "",
      billingAddress: "",
      transactionType: "intra",
    });
    setItems([{ name: "", hsn: "", qty: 1, rate: 0, gst: 18 }]);
    setEditingId(null);
    setShowModal(false);
  };

  // Delete invoice
  const deleteInvoice = (id) =>
    setInvoiceList((prev) => prev.filter((i) => i.id !== id));

  // ---------------- EXPORT JSON (single invoice) ----------------
  const downloadJSON = (invoice) => {
    const blob = new Blob([JSON.stringify(invoice, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${invoice.invoiceNo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- EXPORT EXCEL (CSV) (single invoice) ----------------
  const downloadExcel = (invoice) => {
    // build CSV: header info + items table + totals
    let csv = `Invoice No,${invoice.invoiceNo}\n`;
    csv += `Date,${invoice.date}\n`;
    csv += `Buyer,${invoice.businessName}\n`;
    csv += `GSTIN,${invoice.gstNumber}\n`;
    csv += `Transaction Type,${invoice.transactionType}\n\n`;

    csv += "Sr.No,Item Name,HSN,Qty,Rate,Taxable,GST%,GST Amt\n";
    invoice.items.forEach((it, i) => {
      const taxable = (Number(it.qty || 0) * Number(it.rate || 0)).toFixed(2);
      const gstAmt = ((taxable * Number(it.gst || 0)) / 100).toFixed(2);
      csv += `${i + 1},"${it.name || ""}",${it.hsn || ""},${it.qty || 0},${
        it.rate || 0
      },${taxable},${it.gst || 0},${gstAmt}\n`;
    });

    const totals =
      invoice.totals ||
      calcInvoiceTotals(
        invoice.items || [],
        invoice.transactionType || "intra"
      );
    csv += `\nSubtotal,,,\n, , , , ,${totals.subtotal.toFixed(2)}\n`;
    csv += `Total GST,,,\n, , , , ,${totals.totalGst.toFixed(2)}\n`;
    csv += `Grand Total,,,\n, , , , ,${totals.grandTotal.toFixed(2)}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${invoice.invoiceNo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- PRINT (single invoice) ----------------
  const handlePrint = (inv) => {
    const itemsHtml = (inv.items || [])
      .map(
        (it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.name}</td>
        <td>${it.hsn || "-"}</td>
        <td>${it.qty}</td>
        <td>${it.rate}</td>
        <td>${(it.qty * it.rate).toFixed(2)}</td>
      </tr>`
      )
      .join("");

    const t =
      inv.totals ||
      calcInvoiceTotals(inv.items || [], inv.transactionType || "intra");

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; margin:0; padding:20px;}
            table { width:100%; border-collapse: collapse; margin-top:10px; }
            th, td { border: 1px solid #000; padding: 6px; text-align:center; }
            .left { text-align:left; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center">Vyapari CA - B2B Invoice</h2>
          <p><strong>Invoice:</strong> ${inv.invoiceNo}</p>
          <p><strong>Date:</strong> ${inv.date}</p>
          <p><strong>Buyer:</strong> ${inv.businessName} (${inv.gstNumber})</p>
          <table>
            <thead>
              <tr>
                <th>#</th><th>Item</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <h3 style="text-align:right">Grand Total: ₹${t.grandTotal.toFixed(
            2
          )}</h3>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  // ---------------- EXPORT ALL INVOICES AS SINGLE JSON ----------------
  const downloadAllJSON = () => {
    if (!invoiceList || invoiceList.length === 0) {
      alert("No invoices to download.");
      return;
    }
    const blob = new Blob([JSON.stringify(invoiceList, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `All-Invoices.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- EXPORT ALL INVOICES AS SINGLE CSV ----------------
  const downloadAllExcel = () => {
    if (!invoiceList || invoiceList.length === 0) {
      alert("No invoices to download.");
      return;
    }

    // Build CSV with blocks per invoice
    let csv = "";
    invoiceList.forEach((invoice, idx) => {
      csv += `Invoice No,${invoice.invoiceNo}\n`;
      csv += `Date,${invoice.date}\n`;
      csv += `Buyer,${invoice.businessName}\n`;
      csv += `GSTIN,${invoice.gstNumber}\n`;
      csv += `Transaction Type,${invoice.transactionType}\n\n`;
      csv += "Sr.No,Item Name,HSN,Qty,Rate,Taxable,GST%,GST Amt\n";

      invoice.items.forEach((it, i) => {
        const taxable = (Number(it.qty || 0) * Number(it.rate || 0)).toFixed(2);
        const gstAmt = ((taxable * Number(it.gst || 0)) / 100).toFixed(2);
        // Escape double quotes in name
        const safeName = String(it.name || "").replace(/"/g, '""');
        csv += `${i + 1},"${safeName}",${it.hsn || ""},${it.qty || 0},${
          it.rate || 0
        },${taxable},${it.gst || 0},${gstAmt}\n`;
      });

      const totals =
        invoice.totals ||
        calcInvoiceTotals(
          invoice.items || [],
          invoice.transactionType || "intra"
        );

      csv += `\nSubtotal,,,,,${totals.subtotal.toFixed(2)}\n`;
      csv += `Total GST,,,,,${totals.totalGst.toFixed(2)}\n`;
      csv += `Grand Total,,,,,${totals.grandTotal.toFixed(2)}\n`;

      // Add a blank line between invoices except after last
      if (idx < invoiceList.length - 1) {
        csv += `\n`;
      }
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `All-Invoices.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 text-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-6">B2B Billing</h1>

        <div className="flex items-center gap-3">
          {/* ALL JSON Export (single file with all invoices) */}
          <button
            onClick={downloadAllJSON}
            className="text-amber-600 hover:text-amber-800 p-2 rounded-md border border-amber-100 bg-white"
            title="Download All Invoices (JSON)"
          >
            <FileJson size={18} />
            <span>Download JSON</span>
          </button>

          {/* ALL Excel/CSV Export (single file with all invoices) */}
          <button
            onClick={downloadAllExcel}
            className="text-amber-600 hover:text-green-800 p-2 rounded-md border border-green-100 bg-white"
            title="Download All Invoices (CSV)"
          >
            <FileSpreadsheet size={18} />
            <span>Download CSV</span>
          </button>

          <button
            onClick={() => openModal(null)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            <Plus size={16} /> Add B2B Invoice
          </button>
        </div>
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
            {invoiceList.length ? (
              invoiceList.map((inv, idx) => (
                <tr key={inv.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{idx + 1}</td>
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
                    {/* JSON Export (single invoice) */}
                    <button
                      onClick={() => downloadJSON(inv)}
                      className="text-amber-600 hover:text-amber-800"
                      title="Export JSON"
                    >
                      <FileJson size={18} />
                    </button>

                    {/* Excel/CSV Export (single invoice) */}
                    <button
                      onClick={() => downloadExcel(inv)}
                      className="text-green-600 hover:text-green-800"
                      title="Export Excel"
                    >
                      <FileSpreadsheet size={18} />
                    </button>

                    {/* View */}
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Print */}
                    <button
                      onClick={() => handlePrint(inv)}
                      className="text-black hover:text-gray-700"
                      title="Print"
                    >
                      <Printer size={18} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openModal(inv)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>

                    {/* Delete */}
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
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL — FULL SCREEN (Option B: padded + rounded) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-[1100px] h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Top bar (sticky) */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit B2B Invoice" : "Create B2B Invoice"}
              </h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <X size={26} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {/* Buyer details: 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice No *
                  </label>
                  <input
                    type="text"
                    value={form.invoiceNo}
                    onChange={(e) =>
                      setForm({ ...form, invoiceNo: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    placeholder="Invoice number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buyer Business Name *
                  </label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) =>
                      setForm({ ...form, businessName: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    placeholder="Buyer / Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Number *
                  </label>
                  <input
                    type="text"
                    value={form.gstNumber}
                    onChange={(e) =>
                      setForm({ ...form, gstNumber: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    placeholder="GSTIN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={form.transactionType}
                    onChange={(e) =>
                      setForm({ ...form, transactionType: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option value="intra">Intra-state (CGST + SGST)</option>
                    <option value="inter">Inter-state (IGST)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address
                  </label>
                  <textarea
                    value={form.billingAddress}
                    onChange={(e) =>
                      setForm({ ...form, billingAddress: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    rows={2}
                    placeholder="Billing address"
                  />
                </div>
              </div>

              {/* Items table with inputs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                <div className="overflow-x-auto bg-white border rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">Item Name</th>
                        <th className="p-2 text-left">HSN</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">GST %</th>
                        <th className="p-2 text-right">Taxable</th>
                        <th className="p-2 text-center">Remove</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((it, i) => {
                        const taxable = calcItemTaxable(it);
                        return (
                          <tr key={i} className="border-b">
                            <td className="p-2">{i + 1}</td>

                            <td className="p-2">
                              <input
                                type="text"
                                value={it.name}
                                onChange={(e) =>
                                  updateItem(i, "name", e.target.value)
                                }
                                className="w-full border p-1 rounded"
                                placeholder="Item name"
                              />
                            </td>

                            <td className="p-2">
                              <input
                                type="text"
                                value={it.hsn}
                                onChange={(e) =>
                                  updateItem(i, "hsn", e.target.value)
                                }
                                className="w-full border p-1 rounded"
                                placeholder="HSN"
                              />
                            </td>

                            <td className="p-2">
                              <input
                                type="number"
                                min="1"
                                value={it.qty}
                                onChange={(e) =>
                                  updateItem(i, "qty", e.target.value)
                                }
                                className="w-20 border p-1 rounded text-right"
                              />
                            </td>

                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                value={it.rate}
                                onChange={(e) =>
                                  updateItem(i, "rate", e.target.value)
                                }
                                className="w-28 border p-1 rounded text-right"
                              />
                            </td>

                            <td className="p-2">
                              <select
                                value={it.gst}
                                onChange={(e) =>
                                  updateItem(i, "gst", e.target.value)
                                }
                                className="w-20 border p-1 rounded"
                              >
                                <option value={0}>0</option>
                                <option value={5}>5</option>
                                <option value={12}>12</option>
                                <option value={18}>18</option>
                                <option value={28}>28</option>
                              </select>
                            </td>

                            <td className="p-2 text-right font-medium">
                              {formatCurrency(taxable)}
                            </td>

                            <td className="p-2 text-center">
                              <button
                                onClick={() => removeItem(i)}
                                className="text-red-600"
                                title="Remove"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals preview aligned right */}
              <div className="flex justify-end">
                <div className="w-full md:w-1/3 bg-white border rounded p-4 shadow">
                  <h4 className="font-semibold mb-2">Totals</h4>
                  {(() => {
                    const t = calcInvoiceTotals(items, form.transactionType);
                    return (
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <div>Subtotal</div>
                          <div className="font-medium">
                            {formatCurrency(t.subtotal)}
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <div>Total GST</div>
                          <div className="font-medium">
                            {formatCurrency(t.totalGst)}
                          </div>
                        </div>

                        {form.transactionType === "intra" ? (
                          <>
                            <div className="flex justify-between">
                              <div>CGST</div>
                              <div>{formatCurrency(t.totalCgst)}</div>
                            </div>
                            <div className="flex justify-between">
                              <div>SGST</div>
                              <div>{formatCurrency(t.totalSgst)}</div>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between">
                            <div>IGST</div>
                            <div>{formatCurrency(t.totalIgst)}</div>
                          </div>
                        )}

                        <div className="flex justify-between mt-2 border-t pt-2 font-semibold">
                          <div>Grand Total</div>
                          <div>{formatCurrency(t.grandTotal)}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Bottom fixed buttons */}
            <div className="border-t p-4 bg-white flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="px-5 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={submitInvoice}
                className="px-5 py-2 bg-green-600 text-white rounded-lg"
              >
                {editingId ? "Update Invoice" : "Save Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW INVOICE — FULL SCREEN (Option B) */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-stretch">
          <div className="bg-white m-4 rounded-xl shadow-xl flex flex-col w-full max-h-[calc(100vh-32px)] overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Invoice Details</h2>
              <button
                onClick={() => setViewInvoice(null)}
                className="text-gray-700 hover:text-gray-900"
              >
                <X size={26} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 mb-6">
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
                    <strong>Address:</strong>{" "}
                    {viewInvoice.billingAddress || "-"}
                  </p>
                </div>
              </div>

              <table className="w-full mt-4 text-sm border">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-left">HSN</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Rate</th>
                    <th className="p-2 text-right">Taxable</th>
                    <th className="p-2 text-right">GST</th>
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
                        <td className="p-2 text-right">
                          ₹{taxable.toFixed(2)}
                        </td>
                        <td className="p-2 text-right">{it.gst}%</td>
                        <td className="p-2 text-right">₹{gstAmt.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-6 grid grid-cols-2 gap-2 text-lg">
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

                <div className="font-bold">Grand Total:</div>
                <div className="text-right font-bold">
                  {formatCurrency(viewInvoice.totals.grandTotal)}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-white flex justify-end">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-5 py-2 bg-gray-300 rounded-lg"
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
