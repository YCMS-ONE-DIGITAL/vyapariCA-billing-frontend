import React, { useState } from "react";

const ProductPage = () => {
  const loggedInShopId = "SHOP12345"; // Replace with user ID from login context

  const [formData, setFormData] = useState({
    shop_id: loggedInShopId,
    sku: "",
    product_name: "",
    hsn_sac: "",
    price: "",
    mrp: "",
    tax_percent: "",
    unit: "",
    track_inventory: "off",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Data:", formData);

    alert("Product Saved Successfully!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow"
      >
        {/* Shop ID (Read Only) */}
        <div>
          <label className="block mb-1 font-medium">Shop ID</label>
          <input
            type="text"
            name="shop_id"
            value={formData.shop_id}
            readOnly
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block mb-1 font-medium">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter SKU"
            required
          />
        </div>

        {/* Product Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter Product Name"
            required
          />
        </div>

        {/* HSN / SAC */}
        <div>
          <label className="block mb-1 font-medium">HSN / SAC</label>
          <input
            type="text"
            name="hsn_sac"
            value={formData.hsn_sac}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="HSN/SAC Code"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Selling Price"
            required
          />
        </div>

        {/* MRP */}
        <div>
          <label className="block mb-1 font-medium">MRP</label>
          <input
            type="number"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Maximum Retail Price"
          />
        </div>

        {/* Tax Percent */}
        <div>
          <label className="block mb-1 font-medium">Tax Percent (%)</label>
          <input
            type="number"
            name="tax_percent"
            value={formData.tax_percent}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., 5, 12, 18"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block mb-1 font-medium">Unit</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="kg, piece, box, etc."
          />
        </div>

        {/* Track Inventory */}
        <div>
          <label className="block mb-1 font-medium">Track Inventory</label>
          <select
            name="track_inventory"
            value={formData.track_inventory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="off">Off</option>
            <option value="on">On</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-right">
          <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-600">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductPage;
