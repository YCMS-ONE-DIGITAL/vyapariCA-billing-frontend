import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Tag, Search, X } from "lucide-react";

// ---------------------------------------------------------------------
// Modal Component (NO CHANGE except responsive improvements)
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
    hsn_sac: "",
    price: "",
    mrp: "",
    tax_percent: "",
    unit: "piece",
    track_inventory: "off",
    stock: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        price: String(productToEdit.price),
        mrp: String(productToEdit.mrp),
        tax_percent: String(productToEdit.tax_percent),
        stock:
          productToEdit.stock !== undefined && productToEdit.stock !== null
            ? String(productToEdit.stock)
            : "",
      });
    } else {
      setFormData(initialFormState);
    }
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
      tax_percent: Number(formData.tax_percent) || 0,
      stock: formData.stock === "" ? null : Number(formData.stock),
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
              <label className="text-sm font-medium">Tax (%)</label>
              <input
                type="number"
                name="tax_percent"
                value={formData.tax_percent}
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
// Product Page with FULL MOBILE UI + SR NO.
// ---------------------------------------------------------------------
export default function ProductPage() {
  const loggedInShopId = "SHOP12345";

  const [products, setProducts] = useState([
    {
      id: 1,
      shop_id: loggedInShopId,
      sku: "TALLY-AMC",
      product_name: "Tally AMC",
      hsn_sac: "9982",
      price: 15000,
      mrp: 15000,
      tax_percent: 18,
      unit: "service",
      track_inventory: "off",
      stock: null,
    },
    {
      id: 2,
      shop_id: loggedInShopId,
      sku: "LED-M27",
      product_name: "27-inch Monitor",
      hsn_sac: "8471",
      price: 22500,
      mrp: 25000,
      tax_percent: 28,
      unit: "piece",
      track_inventory: "on",
      stock: 12,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.product_name.toLowerCase().includes(search.toLowerCase())
  );

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
        prev.map((p) => (p.id === payload.id ? payload : p))
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
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* TABLE (Desktop) */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-xs font-bold">SR</th>
              <th className="px-4 py-2 text-left text-xs font-bold">
                Product Name
              </th>
              <th className="px-4 py-2 text-xs font-bold">HSN</th>
              <th className="px-4 py-2 text-xs font-bold">Price</th>
              <th className="px-4 py-2 text-xs font-bold">Tax</th>
              <th className="px-4 py-2 text-xs font-bold">Inv</th>
              <th className="px-4 py-2 text-xs font-bold text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p, index) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2">{p.product_name}</td>
                <td className="px-4 py-2 text-center">{p.hsn_sac}</td>
                <td className="px-4 py-2 text-right">₹ {p.price}</td>
                <td className="px-4 py-2 text-center">{p.tax_percent}%</td>
                <td className="px-4 py-2 text-center">
                  {p.track_inventory === "on" ? "On" : "Off"}
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-indigo-600 p-1"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="sm:hidden space-y-3">
        {filtered.map((p, index) => (
          <div key={p.id} className="bg-white shadow rounded-lg p-4 border">
            <div className="flex justify-between">
              <span className="text-sm font-bold">
                #{index + 1} — {p.product_name}
              </span>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)}>
                  <Edit className="w-5 h-5 text-indigo-600" />
                </button>

                <button onClick={() => handleDelete(p.id)}>
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700">
              <p>HSN: {p.hsn_sac}</p>
              <p>Price: ₹ {p.price}</p>
              <p>Tax: {p.tax_percent}%</p>
              <p>Inventory: {p.track_inventory === "on" ? "On" : "Off"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        loggedInShopId={loggedInShopId}
        onSave={handleSave}
      />
    </div>
  );
}
