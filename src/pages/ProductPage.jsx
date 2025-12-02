import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Tag,
  Search,
  X,
  Eye,
  ArrowUpCircle,
  ArrowDownCircle,
  ClipboardList,
} from "lucide-react";

// ---------------------------------------------------------------------
// VIEW PRODUCT MODAL (READ-ONLY)
// ---------------------------------------------------------------------
const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const fields = [
    ["Product Name", product.product_name],
    ["Brand", product.brand_name || "-"],
    ["SKU", product.sku],
    ["HSN / SAC", product.hsn_sac],
    ["Price (₹)", product.price],
    ["MRP (₹)", product.mrp],
    ["GST (%)", product.GST + "%"],
    ["Unit", product.unit],
    ["Track Inventory", product.track_inventory === "on" ? "Yes" : "No"],
    [
      "Stock",
      product.track_inventory === "on"
        ? product.stock === null
          ? "-"
          : product.stock
        : "-",
    ],
    ["Last Stock Updated", product.last_stock_updated || "-"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(([label, value]) => (
            <div key={label} className="border rounded-lg p-3 bg-gray-50">
              <p className="text-xs text-gray-500 font-semibold">{label}</p>
              <p className="text-sm font-medium mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-between items-center">
          <div>
            <button
              onClick={() => {
                // show history via callback handled in parent; but keep here simple close
                onClose();
              }}
              className="px-4 py-2 border rounded-lg mr-2"
            >
              Close
            </button>
          </div>
          <div className="text-sm text-gray-500">
            <div>Created: {product.created_at || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// ADD / EDIT PRODUCT MODAL
// (unchanged from original but kept here for single-file completeness)
// ---------------------------------------------------------------------
const ProductFormModal = ({
  isOpen,
  onClose,
  productToEdit,
  loggedInShopId,
  onSave,
}) => {
  const initialFormState = {
    id: null,
    shop_id: loggedInShopId || "",
    sku: "",
    product_name: "",
    brand_name: "",
    hsn_sac: "",
    price: "",
    mrp: "",
    GST: "",
    unit: "piece",
    track_inventory: "off",
    stock: "",
    created_at: new Date().toLocaleString(),
    history: [],
    last_stock_updated: null,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        price: String(productToEdit.price),
        mrp: String(productToEdit.mrp),
        brand_name: productToEdit.brand_name || "",
        GST: String(productToEdit.GST),
        stock:
          productToEdit.stock !== undefined && productToEdit.stock !== null
            ? String(productToEdit.stock)
            : "",
      });
    } else {
      setFormData(initialFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked ? "on" : "off" }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.product_name || !formData.price) {
      alert("Please fill product name and price");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      mrp: Number(formData.mrp) || 0,
      GST: Number(formData.GST) || 0,
      stock:
        formData.track_inventory === "on"
          ? formData.stock === ""
            ? 0
            : Number(formData.stock)
          : null,
      created_at: formData.created_at || new Date().toLocaleString(),
      history: formData.history || [],
      last_stock_updated: formData.last_stock_updated || null,
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl p-5 sm:p-6 z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {productToEdit ? "Edit Product" : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <input
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Product name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Brand Name</label>
              <input
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Brand name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">SKU</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="SKU code"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">MRP (₹)</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">GST (%)</label>
              <input
                type="number"
                name="GST"
                value={formData.GST}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">HSN / SAC</label>
              <input
                name="hsn_sac"
                value={formData.hsn_sac}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="piece">Piece</option>
                <option value="kg">KG</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                name="track_inventory"
                checked={formData.track_inventory === "on"}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label className="text-sm font-medium">Track Inventory</label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {productToEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// PRODUCT PAGE (with Stock Management)
// ---------------------------------------------------------------------
export default function ProductPage() {
  const loggedInShopId = "SHOP12345";

  // initial products with history and last_stock_updated fields
  const [products, setProducts] = useState([
    {
      id: 1,
      shop_id: loggedInShopId,
      sku: "TALLY-AMC",
      product_name: "Tally AMC",
      brand_name: "Tally",
      hsn_sac: "9982",
      price: 15000,
      mrp: 15000,
      GST: 18,
      unit: "service",
      track_inventory: "off",
      stock: null,
      history: [],
      created_at: new Date().toLocaleString(),
      last_stock_updated: null,
    },
    {
      id: 2,
      shop_id: loggedInShopId,
      sku: "LED-M27",
      product_name: "27-inch Monitor",
      brand_name: "Samsung",
      hsn_sac: "8471",
      price: 22500,
      mrp: 25000,
      GST: 28,
      unit: "piece",
      track_inventory: "on",
      stock: 12,
      history: [
        {
          date: new Date().toLocaleString(),
          qty: +12,
          type: "Added",
          notes: "Initial stock",
        },
      ],
      created_at: new Date().toLocaleString(),
      last_stock_updated: new Date().toLocaleString(),
    },
  ]);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);

  const [search, setSearch] = useState("");

  // Stock modal state
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [stockAction, setStockAction] = useState("add"); // 'add' or 'remove'
  const [stockQty, setStockQty] = useState("");
  const [stockNotes, setStockNotes] = useState("");

  // History drawer / selected product for history view
  const [selectedHistoryProduct, setSelectedHistoryProduct] = useState(null);

  // Derived statistics for top summary
  const totalProducts = products.length;
  const inventoryEnabledCount = products.filter(
    (p) => p.track_inventory === "on"
  ).length;
  const lowStockCount = products.filter(
    (p) =>
      p.track_inventory === "on" &&
      p.stock !== null &&
      p.stock <= 5 &&
      p.stock > 0
  ).length;
  const outOfStockCount = products.filter(
    (p) => p.track_inventory === "on" && (p.stock === 0 || p.stock === null)
  ).length;

  // Filtering
  const filtered = products.filter((p) =>
    p.product_name.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers for product create/edit
  const openCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (p) => {
    setProductToEdit(p);
    setIsModalOpen(true);
  };

  const handleSave = (payload) => {
    if (payload.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p))
      );
    } else {
      setProducts((prev) => [...prev, { ...payload, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Stock modal open
  const openStockModal = (product, action = "add") => {
    setStockProduct(product);
    setStockAction(action);
    setStockQty("");
    setStockNotes("");
    setIsStockModalOpen(true);
  };

  // Apply stock update (add/remove)
  const applyStockUpdate = () => {
    if (!stockProduct) return;
    const qty = Number(stockQty);
    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== stockProduct.id) return p;

        // if inventory not tracked, enable on update
        const trackOn = p.track_inventory === "on" ? "on" : "on";

        const currentStock =
          p.stock === null || p.stock === undefined ? 0 : Number(p.stock);
        const newStock =
          stockAction === "add"
            ? currentStock + qty
            : Math.max(0, currentStock - qty);

        const newHistoryEntry = {
          date: new Date().toLocaleString(),
          qty: stockAction === "add" ? +qty : -qty,
          type: stockAction === "add" ? "Added" : "Removed",
          notes: stockNotes || "",
        };

        const newHistory = Array.isArray(p.history)
          ? [newHistoryEntry, ...p.history]
          : [newHistoryEntry];

        return {
          ...p,
          track_inventory: trackOn,
          stock: newStock,
          history: newHistory,
          last_stock_updated: new Date().toLocaleString(),
        };
      })
    );

    setIsStockModalOpen(false);
    setStockProduct(null);
    setStockQty("");
    setStockNotes("");
  };

  // Open product view
  const openView = (p) => {
    setProductToView(p);
    setIsViewOpen(true);
  };

  // Helper: status badge
  const StockBadge = ({ product }) => {
    if (product.track_inventory !== "on")
      return (
        <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-700">
          —
        </span>
      );
    const s =
      product.stock === null || product.stock === undefined ? 0 : product.stock;
    if (s === 0)
      return (
        <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-700">
          Out of Stock
        </span>
      );
    if (s <= 5)
      return (
        <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-700">
          Low Stock
        </span>
      );
    return (
      <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-700">
        In Stock
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2">
          <Tag className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl sm:text-2xl font-bold">
            Product & Service Catalog
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border rounded-lg pl-10 p-2"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          </div>

          <button
            onClick={openCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> ADD Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-sm text-gray-500">Total Products</div>
          <div className="text-xl font-bold">{totalProducts}</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-sm text-gray-500">Inventory Enabled</div>
          <div className="text-xl font-bold">{inventoryEnabledCount}</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-sm text-gray-500">Low Stock (&le; 5)</div>
          <div className="text-xl font-bold text-yellow-600">
            {lowStockCount}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-sm text-gray-500">Out of Stock</div>
          <div className="text-xl font-bold text-red-600">
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-200">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="px-4 py-2 text-xs font-bold">SR</th>
              <th className="px-4 py-2 text-xs font-bold">Product Name</th>
              <th className="px-4 py-2 text-xs font-bold">Brand</th>
              <th className="px-4 py-2 text-xs font-bold text-center">HSN</th>
              <th className="px-4 py-2 text-xs font-bold text-center">Price</th>
              <th className="px-4 py-2 text-xs font-bold text-center">GST</th>
              <th className="px-4 py-2 text-xs font-bold text-center">Inv</th>
              <th className="px-4 py-2 text-xs font-bold text-center">Stock</th>
              <th className="px-4 py-2 text-xs font-bold text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p, index) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{index + 1}</td>

                <td className="px-4 py-2 text-center">{p.product_name}</td>

                <td className="px-4 py-2 text-center">{p.brand_name || "-"}</td>

                <td className="px-4 py-2 text-center">{p.hsn_sac}</td>

                <td className="px-4 py-2 text-center">₹ {p.price}</td>

                <td className="px-4 py-2 text-center">{p.GST}%</td>

                <td className="px-4 py-2 text-center">
                  {p.track_inventory === "on" ? "On" : "Off"}
                </td>

                <td className="px-4 py-2 text-center">
                  {p.track_inventory === "on" ? (
                    <div className="flex flex-col items-center">
                      <div className="font-semibold">
                        {p.stock !== null && p.stock !== undefined
                          ? p.stock
                          : 0}
                      </div>
                      <div className="mt-1">
                        <StockBadge product={p} />
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => openView(p)}
                    className="text-blue-600 p-1"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  {/* STOCK ADD */}
                  <button
                    onClick={() => openStockModal(p, "add")}
                    className="text-green-600 p-1"
                    title="Add Stock"
                  >
                    <ArrowUpCircle className="w-5 h-5" />
                  </button>

                  {/* STOCK REMOVE */}
                  <button
                    onClick={() => openStockModal(p, "remove")}
                    className="text-amber-600 p-1"
                    title="Remove Stock"
                  >
                    <ArrowDownCircle className="w-5 h-5" />
                  </button>

                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-indigo-600 p-1"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* VIEW HISTORY */}
                  <button
                    onClick={() => setSelectedHistoryProduct(p)}
                    className="text-gray-700 p-1"
                    title="Stock History"
                  >
                    <ClipboardList className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        loggedInShopId={loggedInShopId}
        onSave={handleSave}
      />

      {/* View Modal */}
      <ViewProductModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        product={productToView}
      />

      {/* Stock Modal */}
      {isStockModalOpen && stockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsStockModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {stockAction === "add" ? "Add Stock" : "Remove Stock"}
              </h3>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-3">
              <div className="text-sm text-gray-500">Product</div>
              <div className="font-semibold">{stockProduct.product_name}</div>
              <div className="text-xs text-gray-400">
                Current stock:{" "}
                {stockProduct.stock !== null && stockProduct.stock !== undefined
                  ? stockProduct.stock
                  : 0}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Notes (optional)</label>
                <input
                  value={stockNotes}
                  onChange={(e) => setStockNotes(e.target.value)}
                  placeholder="e.g. New shipment, correction"
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={applyStockUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  {stockAction === "add" ? "Add" : "Remove"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock History Drawer */}
      {selectedHistoryProduct && (
        <div className="fixed right-4 top-20 z-40 w-[420px] max-w-full">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold">
                  {selectedHistoryProduct.product_name}
                </div>
                <div className="text-xs text-gray-500">Stock history</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedHistoryProduct(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {(!selectedHistoryProduct.history ||
                selectedHistoryProduct.history.length === 0) && (
                <div className="text-sm text-gray-500">
                  No history available
                </div>
              )}

              {selectedHistoryProduct.history &&
                selectedHistoryProduct.history.map((h, idx) => (
                  <div key={idx} className="border-b py-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        {h.type} {Math.abs(h.qty)}
                      </div>
                      <div className="text-xs text-gray-500">{h.date}</div>
                    </div>
                    {h.notes && (
                      <div className="text-xs text-gray-600 mt-1">
                        Notes: {h.notes}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              Last updated: {selectedHistoryProduct.last_stock_updated || "-"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
