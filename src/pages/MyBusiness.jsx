import React, { useState } from "react";
import { Upload, Pencil } from "lucide-react";

const MyBusiness = () => {
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);

  // 🌟 NEW STATES
  const [businessType, setBusinessType] = useState("");
  const [category, setCategory] = useState("");

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSignature(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {/* TOP: BUSINESS LOGO */}
      <div className="flex justify-center mb-10">
        <label className="relative cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
          <div className="w-32 h-32 rounded-full border flex items-center justify-center overflow-hidden bg-gray-100 shadow-inner">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">Add Logo</span>
            )}
          </div>

          {/* Edit Icon */}
          <div className="absolute bottom-2 right-2 bg-white shadow-md rounded-full p-1">
            <Pencil size={18} className="text-blue-600" />
          </div>
        </label>
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT — Business Details */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Business Details</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Business Name*</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="My Company"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Enter Phone Number"
              />
            </div>

            <div>
              <label className="text-sm font-medium">GSTIN</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Enter GSTIN"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email ID</label>
              <input
                type="email"
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Enter Email ID"
              />
            </div>
          </div>
        </div>

        {/* MIDDLE — More Details */}
        <div>
          <h2 className="text-lg font-semibold mb-3">More Details</h2>

          <div className="space-y-4">
            {/* BUSINESS TYPE */}
            <div>
              <label className="text-sm font-medium">Business Type</label>
              <select
                className="w-full border rounded-lg p-2 mt-1"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                <option value="">Select Business Type</option>
                <option value="shop">Shop / Store</option>
                <option value="ca">CA Firm</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>

            {/* 🌟 DYNAMIC FIELDS FOR BUSINESS TYPE */}
            {businessType === "shop" && (
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Shop Name"
                />
                <input
                  className="border p-2 rounded w-full"
                  placeholder="GST Number"
                />
              </div>
            )}

            {businessType === "ca" && (
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="CA Firm Name"
                />
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Registration Number"
                />
              </div>
            )}

            {businessType === "freelancer" && (
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Your Skill"
                />
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Experience"
                />
              </div>
            )}

            {/* BUSINESS CATEGORY */}
            <div>
              <label className="text-sm font-medium">Business Category</label>
              <select
                className="w-full border rounded-lg p-2 mt-1"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Business Category</option>
                <option value="product">Product Based</option>
                <option value="service">Service Based</option>
              </select>
            </div>

            {/* 🌟 DYNAMIC FIELDS FOR CATEGORY */}
            {category === "product" && (
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Product Name"
                />
                <input
                  className="border p-2 rounded w-full"
                  placeholder="HSN Code"
                />
              </div>
            )}

            {category === "service" && (
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Service Name"
                />
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Service Charges"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">State</label>
              <select className="w-full border rounded-lg p-2 mt-1">
                <option>Select State</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Pincode</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Enter Pincode"
              />
            </div>
          </div>
        </div>

        {/* RIGHT — Address + Signature */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Business Address</h2>

          <textarea
            className="w-full border rounded-lg p-2 h-28 resize-none"
            placeholder="Enter Business Address"
          />

          <h2 className="text-lg font-semibold mt-6 mb-3">Add Signature</h2>

          <label className="border border-dashed rounded-lg p-6 flex items-center justify-center cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleSignatureUpload}
            />

            {!signature ? (
              <div className="flex flex-col items-center text-gray-500">
                <Upload size={28} />
                <p>Upload Signature</p>
              </div>
            ) : (
              <img
                src={signature}
                alt="Signature"
                className="h-20 object-contain"
              />
            )}
          </label>
        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="flex justify-end gap-4 mt-10">
        <button className="px-5 py-2 border rounded-lg">Cancel</button>
        <button className="px-6 py-2 bg-red-500 text-white rounded-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default MyBusiness;
