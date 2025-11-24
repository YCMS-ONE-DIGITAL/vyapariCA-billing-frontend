// InvoicePage.jsx
// Requires: npm install html2canvas jspdf lucide-react framer-motion
import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Download,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
      (inv.invoiceNo || "").toLowerCase().includes(search.toLowerCase()) ||
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
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // --------------------
  // PRINT / SHARE HELPERS
  // --------------------

  // create an invoice HTML fragment (string) used for print / capture
  function buildInvoiceHtmlString(inv, options = { pos: false }) {
    const subtotal = calcSubtotal(inv.items || []);
    const gst = calcGST(subtotal, inv.gstPercent);
    const total = calcTotal(subtotal, inv.gstPercent);

    // POS narrow receipt
    if (options.pos) {
      const itemsRows = inv.items
        .map(
          (it) => `<tr>
            <td style="padding:4px 0; font-size:13px;">${escapeHtml(
              it.desc
            )}</td>
            <td style="text-align:center; font-size:13px;">${it.qty}</td>
            <td style="text-align:right; font-size:13px;">${Number(
              it.rate
            ).toFixed(2)}</td>
            <td style="text-align:right; font-size:13px;">${Number(
              it.qty * it.rate
            ).toFixed(2)}</td>
          </tr>`
        )
        .join("");

      return `
        <div style="font-family:monospace; width:260px; padding:10px; margin:0 auto; text-align:center;">
          <div style="text-align:center;">
            <h3 style="margin:0;">Vyapari CA</h3>
            <div>Invoice Receipt</div>
          </div>
          <div style="margin-top:8px; text-align:left;">
            <div><strong>Invoice:</strong> ${inv.invoiceNo}</div>
            <div><strong>Date:</strong> ${inv.invoiceDate}</div>
            <div><strong>Customer:</strong> ${escapeHtml(
              inv.customerName
            )}</div>
          </div>
          <hr style="border:none;border-top:1px dashed #000;margin:8px 0" />
          <table style="width:100%;border-collapse:collapse; text-align:left;">
            <thead>
              <tr>
                <th style="text-align:left;font-size:13px;">Item</th>
                <th style="text-align:center;font-size:13px;">Qty</th>
                <th style="text-align:right;font-size:13px;">Rate</th>
                <th style="text-align:right;font-size:13px;">Amt</th>
              </tr>
            </thead>
            <tbody>${itemsRows}</tbody>
          </table>
          <hr style="border:none;border-top:1px dashed #000;margin:8px 0" />
          <div style="text-align:left;">
            <div><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</div>
            <div><strong>GST (${inv.gstPercent}%):</strong> ${formatCurrency(
        gst
      )}</div>
            <div style="font-weight:bold;"><strong>Total:</strong> ${formatCurrency(
              total
            )}</div>
          </div>
          <hr style="border:none;border-top:1px dashed #000;margin:8px 0" />
          <div style="text-align:center;">Thank you! Visit Again</div>
        </div>
      `;
    }

    // default A4 invoice — centered on page when printed or captured
    const rows = inv.items
      .map(
        (it, i) => `<tr>
          <td style="padding:8px;border:1px solid #ddd;text-align:center">${
            i + 1
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

    return `
      <div style="font-family:Arial,Helvetica,sans-serif; padding:20px; display:flex; align-items:center; justify-content:center; min-height:100vh;">
        <div style="max-width:800px; width:100%; box-shadow:0 0 0 rgba(0,0,0,0);">
          <div style="text-align:center;">
            <h2 style="margin:0">Vyapari CA</h2>
            <p style="margin:4px 0 12px 0;">Invoice</p>
          </div>

          <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:10px;">
            <div><strong>Invoice:</strong> ${inv.invoiceNo}</div>
            <div><strong>Date:</strong> ${inv.invoiceDate}</div>
            <div><strong>Customer:</strong> ${escapeHtml(
              inv.customerName
            )}</div>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-top:10px">
            <thead>
              <tr>
                <th style="padding:8px;border:1px solid #ddd">#</th>
                <th style="padding:8px;border:1px solid #ddd">Description</th>
                <th style="padding:8px;border:1px solid #ddd">Qty</th>
                <th style="padding:8px;border:1px solid #ddd;text-align:right">Rate</th>
                <th style="padding:8px;border:1px solid #ddd;text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr><td colspan="4" style="padding:8px;border:1px solid #ddd;text-align:right">Subtotal</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${formatCurrency(
                calcSubtotal(inv.items)
              )}</td></tr>
              <tr><td colspan="4" style="padding:8px;border:1px solid #ddd;text-align:right">GST (${
                inv.gstPercent
              }%)</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${formatCurrency(
      calcGST(calcSubtotal(inv.items), inv.gstPercent)
    )}</td></tr>
              <tr><td colspan="4" style="padding:8px;border:1px solid #ddd;text-align:right"><strong>Total</strong></td><td style="padding:8px;border:1px solid #ddd;text-align:right"><strong>${formatCurrency(
                calcTotal(calcSubtotal(inv.items), inv.gstPercent)
              )}</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // helper to create a temporary DOM node containing invoice HTML, returns the node reference
  function createTempInvoiceNode(htmlString) {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    wrapper.style.zIndex = "999999";
    wrapper.innerHTML = htmlString;
    document.body.appendChild(wrapper);
    return wrapper;
  }

  // Share as plain WhatsApp text using wa.me
  function shareAsText(inv) {
    const subtotal = calcSubtotal(inv.items || []);
    const gst = calcGST(subtotal, inv.gstPercent);
    const total = calcTotal(subtotal, inv.gstPercent);

    const text = [
      `*Vyapari CA - Invoice*`,
      `Invoice: ${inv.invoiceNo}`,
      `Date: ${inv.invoiceDate}`,
      `Customer: ${inv.customerName}`,
      ``,
      `Items:`,
      ...inv.items.map(
        (it, idx) =>
          `${idx + 1}) ${it.desc} — ${it.qty} x ${formatCurrency(
            it.rate
          )} = ${formatCurrency(it.qty * it.rate)}`
      ),
      ``,
      `Subtotal: ${formatCurrency(subtotal)}`,
      `GST (${inv.gstPercent}%): ${formatCurrency(gst)}`,
      `Total: ${formatCurrency(total)}`,
      ``,
      `Thank you for your business!`,
    ].join("\n");

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  // Share as image: render temporary node → html2canvas → share or download
  async function shareAsImage(inv) {
    try {
      const html = buildInvoiceHtmlString(inv, { pos: false }); // use normal invoice look for image
      const node = createTempInvoiceNode(html);

      // use html2canvas
      const canvas = await html2canvas(node, { scale: 2 });
      node.remove();

      const dataUrl = canvas.toDataURL("image/png");
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${inv.invoiceNo}.png`, {
        type: "image/png",
      });

      // Try Web Share API (files)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invoice ${inv.invoiceNo}`,
          text: `Invoice ${inv.invoiceNo}`,
        });
        return;
      }

      // fallback: download the image
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${inv.invoiceNo}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert("Image downloaded. Share it on WhatsApp or other apps manually.");
    } catch (err) {
      console.error("shareAsImage error:", err);
      alert("Unable to share image on this device. Try PDF or Text share.");
    }
  }

  // Share as PDF: render node -> html2canvas -> jsPDF -> share or download
  async function shareAsPDF(inv) {
    try {
      const html = buildInvoiceHtmlString(inv, { pos: false });
      const node = createTempInvoiceNode(html);

      const canvas = await html2canvas(node, { scale: 2 });
      node.remove();

      const imgData = canvas.toDataURL("image/png");
      // create jsPDF (portrait A4)
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let y = 0;
      pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
      // Note: If imageHeight > pageHeight, further splitting can be implemented.

      const pdfBlob = pdf.output("blob");
      const file = new File([pdfBlob], `${inv.invoiceNo}.pdf`, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invoice ${inv.invoiceNo}`,
          text: `Invoice ${inv.invoiceNo}`,
        });
        return;
      }

      // fallback – trigger download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${inv.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert("PDF downloaded. You can share it on WhatsApp from your device.");
    } catch (err) {
      console.error("shareAsPDF error:", err);
      alert("Unable to create/share PDF on this device.");
    }
  }

  // Print Invoice (POS Auto-Print + Auto-Close small window)
  function openPOSPrint(inv) {
    const subtotal = calcSubtotal(inv.items || []);
    const gst = calcGST(subtotal, inv.gstPercent);
    const total = calcTotal(subtotal, inv.gstPercent);

    const itemsHtml = inv.items
      .map(
        (it) => `
      <tr>
        <td style="padding:4px 0; text-align:left;">${escapeHtml(it.desc)}</td>
        <td style="text-align:center;">${it.qty}</td>
        <td style="text-align:right;">${Number(it.rate).toFixed(2)}</td>
        <td style="text-align:right;">${Number(it.qty * it.rate).toFixed(
          2
        )}</td>
      </tr>`
      )
      .join("");

    const printWindow = window.open(
      "",
      "PRINT",
      "width=350,height=500,top=100,left=100,toolbar=no,menubar=no,scrollbars=no,resizable=no"
    );

    const html = `
    <html>
      <head>
        <title>Invoice Receipt</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
          body {
            font-family: monospace;
            width: 100%;
            padding: 10px;
            margin: 0;
            display:flex;
            align-items:center;
            justify-content:center;
          }
          .receipt {
            width:260px;
          }
          .center { text-align: center; }
          table { width: 100%; font-size: 13px; border-collapse: collapse; }
          td, th { padding:4px 0; }
          hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
        </style>
      </head>

      <body>
        <div class="receipt">
          <div class="center">
            <h3 style="margin:0;">Vyapari CA</h3>
            <div>Invoice Receipt</div>
          </div>

          <p><b>Invoice No:</b> ${inv.invoiceNo}</p>
          <p><b>Date:</b> ${inv.invoiceDate}</p>
          <p><b>Customer:</b> ${escapeHtml(inv.customerName)}</p>

          <hr />

          <table>
            <thead>
              <tr>
                <th style="text-align:left;">Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Rate</th>
                <th style="text-align:right;">Amt</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <hr />

          <p><b>Subtotal:</b> ₹${subtotal.toFixed(2)}</p>
          <p><b>GST (${inv.gstPercent}%):</b> ₹${gst.toFixed(2)}</p>
          <p><b>Total:</b> ₹${total.toFixed(2)}</p>

          <hr />

          <div class="center">
            <p>Thank you!</p>
            <p>Visit Again</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 600);
            }, 250);
          };
        </script>
      </body>
    </html>
  `;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  // --------------------
  // Page navigation
  // --------------------
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // totals for preview
  const formSubtotal = calcSubtotal(form.items);
  const formGST = calcGST(formSubtotal, form.gstPercent);
  const formTotal = calcTotal(formSubtotal, form.gstPercent);

  // --------------------
  // UI START
  // --------------------
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
            className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Invoice
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-[900px] w-full table-auto">
          <thead>
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
                        inv.status === "Paid"
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
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Print (POS) */}
                      <button
                        onClick={() => openPOSPrint(inv)}
                        className="text-green-600"
                        title="Print (POS)"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* WhatsApp Text */}
                      <button
                        onClick={() => shareAsText(inv)}
                        className="text-green-700"
                        title="Share as WhatsApp Text"
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>

                      {/* Share as Image */}
                      <button
                        onClick={() => shareAsImage(inv)}
                        className="text-indigo-600"
                        title="Share as Image"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Share as PDF */}
                      <button
                        onClick={() => shareAsPDF(inv)}
                        className="text-indigo-800"
                        title="Share as PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => confirmDelete(inv.id)}
                        className="text-red-600"
                        title="Delete"
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
                    <option>Paid</option>
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
                    <div className="grid grid-cols-12 gap-2" key={idx}>
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
