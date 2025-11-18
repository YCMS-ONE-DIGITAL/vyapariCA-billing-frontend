import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Tag,
  Search,
  X,
  DollarSign,
  Package,
} from "lucide-react";

// -----------------------------------------------------------------------------
// ProductFormModal (embedded component)
// -----------------------------------------------------------------------------
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
      // Map only the fields we expect, and make sure numbers are strings for inputs
      setFormData({
        id: productToEdit.id || null,
        shop_id: productToEdit.shop_id || loggedInShopId || "",
        sku: productToEdit.sku || "",
        product_name: productToEdit.product_name || "",
        hsn_sac: productToEdit.hsn_sac || "",
        price:
          productToEdit.price !== undefined && productToEdit.price !== null
            ? String(productToEdit.price)
            : "",
        mrp:
          productToEdit.mrp !== undefined && productToEdit.mrp !== null
            ? String(productToEdit.mrp)
            : "",
        tax_percent:
          productToEdit.tax_percent !== undefined &&
          productToEdit.tax_percent !== null
            ? String(productToEdit.tax_percent)
            : "",
        unit: productToEdit.unit || "piece",
        track_inventory: productToEdit.track_inventory || "off",
        stock:
          productToEdit.stock !== undefined && productToEdit.stock !== null
            ? String(productToEdit.stock)
            : "",
      });
    } else {
      setFormData(initialFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToEdit, isOpen, loggedInShopId]);

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

    // Basic validation (you can extend as required)
    if (!formData.product_name || !formData.price) {
      alert("Please fill product name and price");
      return;
    }

    // Convert numeric fields to numbers before sending up
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0  bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {productToEdit ? "Edit Product" : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. Imported PC Monitor (27 inch)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. LED-M27"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="0"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">MRP (₹)</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="0"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tax (%)</label>
              <input
                type="number"
                name="tax_percent"
                value={formData.tax_percent}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. 18"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                HSN / SAC
              </label>
              <input
                name="hsn_sac"
                value={formData.hsn_sac}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. 8471"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="piece">Piece</option>
                <option value="service">Service</option>
                <option value="kg">KG</option>
                <option value="meter">Meter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock (optional)
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. 10"
                min="0"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Track Inventory</label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="track_inventory"
                  checked={formData.track_inventory === "on"}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm">
                  {formData.track_inventory === "on" ? "On" : "Off"}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {productToEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main ProductPage
// -----------------------------------------------------------------------------
export default function ProductPage() {
  const loggedInShopId = "SHOP12345"; // mock — replace with real auth value

  const [products, setProducts] = useState([
    {
      id: 1,
      shop_id: loggedInShopId,
      sku: "TALLY-AMC",
      product_name: "Tally Annual Maintenance",
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
      product_name: "Imported PC Monitor (27 inch)",
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

  const openCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (payload) => {
    // If payload has id -> update, else create new
    if (payload.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p))
      );
      console.log("Updated product", payload.id);
    } else {
      const newId = Date.now();
      const newProduct = { ...payload, id: newId };
      setProducts((prev) => [...prev, newProduct]);
      console.log("Created product", newId);
    }

    // TODO: integrate with your API (Spring Boot / Firestore) here.
  };

  const handleDelete = (id) => {
    const yes = window.confirm("Are you sure you want to delete this product?");
    if (!yes) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.product_name.toLowerCase().includes(q) ||
      (p.sku || "").toLowerCase().includes(q) ||
      (p.hsn_sac || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex items-center gap-3">
          <Tag className="w-7 h-7 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold">Product & Service Catalog</h1>
            <p className="text-sm text-gray-500">
              Manage products, pricing & inventory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU or HSN"
              className="w-full border rounded-lg pl-10 pr-3 py-2"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Product Name / SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                HSN/SAC
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Price (₹)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Tax (%)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Inventory
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-indigo-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.product_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    SKU: {product.sku || "N/A"}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.hsn_sac || "N/A"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                  ₹{" "}
                  {Number(product.price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                  {product.tax_percent}%
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.track_inventory === "on"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.track_inventory === "on" ? "On" : "Off"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition"
                    title="Edit Product"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition"
                    title="Delete Product"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No products found. Click "Add Product" to create your first item.
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        loggedInShopId={loggedInShopId}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
