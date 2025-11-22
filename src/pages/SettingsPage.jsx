import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // ------------------ LOAD DATA FROM LOCAL STORAGE ------------------
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("vyapari_profile");
    return saved
      ? JSON.parse(saved)
      : {
          // PROFILE
          name: "",
          username: "",
          email: "",
          phone: "",
          altPhone: "",
          dob: "",
          gender: "",
          photo: "",

          // BUSINESS
          businessName: "",
          businessType: "",
          businessEmail: "",
          businessPhone: "",
          gstin: "",
          pan: "",
          udyam: "",
          address: "",
          billingAddress: "",
          shippingAddress: "",
          state: "",
          city: "",
          pincode: "",
          logo: "",

          // SECURITY
          password: "",
        };
  });

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // UPDATE FIELD FUNCTION
  const updateField = (key, value) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  // SAVE ALL DATA
  const saveProfile = () => {
    if (newPassword.trim() !== "") {
      updateField("password", newPassword);
    }
    localStorage.setItem("vyapari_profile", JSON.stringify(profile));
    alert("Profile Updated!");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl flex gap-8">
        {/* ---------------------- LEFT TABS ---------------------- */}
        <div className="w-60 border-r pr-4">
          <h2 className="text-xl font-bold mb-1">Settings</h2>
          <p className="text-gray-500 text-sm mb-4">
            Manage your profile & security
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`text-left px-3 py-2 rounded-md font-medium ${
                activeTab === "profile"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              Profile Settings
            </button>

            <button
              onClick={() => setActiveTab("business")}
              className={`text-left px-3 py-2 rounded-md font-medium ${
                activeTab === "business"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              Business Settings
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`text-left px-3 py-2 rounded-md font-medium ${
                activeTab === "security"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              Security Settings
            </button>
          </div>
        </div>

        {/* ---------------------- RIGHT SIDE CONTENT ---------------------- */}
        <div className="flex-1">
          {/* ---------------------- PROFILE SECTION ---------------------- */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="Username"
                  value={profile.username}
                  onChange={(e) => updateField("username", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={profile.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={profile.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="Alternate Phone"
                  value={profile.altPhone}
                  onChange={(e) => updateField("altPhone", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="date"
                  value={profile.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <select
                  value={profile.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <div>
                  <label className="text-sm text-gray-600">Profile Image</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      updateField(
                        "photo",
                        URL.createObjectURL(e.target.files[0])
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---------------------- BUSINESS SECTION ---------------------- */}
          {activeTab === "business" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Business Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Business Name"
                  value={profile.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <select
                  value={profile.businessType}
                  onChange={(e) => updateField("businessType", e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Business Type</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Manufacturer">Manufacturer</option>
                </select>

                <input
                  type="email"
                  placeholder="Business Email"
                  value={profile.businessEmail}
                  onChange={(e) => updateField("businessEmail", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="Business Phone"
                  value={profile.businessPhone}
                  onChange={(e) => updateField("businessPhone", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="GSTIN"
                  value={profile.gstin}
                  onChange={(e) => updateField("gstin", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="PAN Number"
                  value={profile.pan}
                  onChange={(e) => updateField("pan", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="Udyam Registration No"
                  value={profile.udyam}
                  onChange={(e) => updateField("udyam", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={profile.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={profile.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  value={profile.pincode}
                  onChange={(e) => updateField("pincode", e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <textarea
                  placeholder="Billing Address"
                  value={profile.billingAddress}
                  onChange={(e) =>
                    updateField("billingAddress", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />

                <textarea
                  placeholder="Shipping Address"
                  value={profile.shippingAddress}
                  onChange={(e) =>
                    updateField("shippingAddress", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />

                <div>
                  <label className="text-sm text-gray-600">Business Logo</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      updateField(
                        "logo",
                        URL.createObjectURL(e.target.files[0])
                      )
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---------------------- SECURITY SECTION ---------------------- */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Password Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CURRENT PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Current Password"
                    value={profile.password}
                    readOnly
                    className="border p-2 rounded w-full pr-10 bg-gray-100 cursor-not-allowed"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {/* NEW PASSWORD */}
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border p-2 rounded w-full pr-10"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SAVE BUTTON */}
          <button
            onClick={saveProfile}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
