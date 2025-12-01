import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Tag, Search, X, Eye } from "lucide-react";

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
    ["Stock", product.stock === null ? "-" : product.stock],
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

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// ADD / EDIT PRODUCT MODAL
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
// PRODUCT PAGE
// ---------------------------------------------------------------------
export default function ProductPage() {
  const loggedInShopId = "SHOP12345";

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
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);

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
            <Plus className="w-4 h-4" /> ADD Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="block bg-white rounded-xl shadow overflow-x-auto w-full">
        <table className="min-w-[1050px] w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-xs font-bold">SR</th>
              <th className="px-4 py-2 text-xs font-bold">Product Name</th>
              <th className="px-4 py-2 text-xs font-bold">Brand</th>
              <th className="px-4 py-2 text-xs font-bold text-center">HSN</th>
              <th className="px-4 py-2 text-xs font-bold text-center">Price</th>
              <th className="px-4 py-2 text-xs font-bold text-center">GST</th>
              <th className="px-4 py-2 text-xs font-bold text-center">Inv</th>
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

                <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => {
                      setProductToView(p);
                      setIsViewOpen(true);
                    }}
                    className="text-blue-600 p-1"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-indigo-600 p-1"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  {/* DELETE BUTTON */}
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
    </div>
  );
}
