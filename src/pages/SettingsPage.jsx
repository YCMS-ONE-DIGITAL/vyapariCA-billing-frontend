import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("vyapari_profile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          username: "",
          email: "",
          phone: "",
          altPhone: "",
          dob: "",
          gender: "",
          photo: "",

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

          caName: "",
          caNumber: "",
          caEmail: "",
          caAddress: "",
          caFirmName: "",
          caCertNumber: "",

          password: "",
        };
  });

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const updateField = (key, value) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const saveProfile = () => {
    if (newPassword.trim() !== "") {
      updateField("password", newPassword);
    }
    localStorage.setItem("vyapari_profile", JSON.stringify(profile));
    alert("Profile Updated!");
  };

  return (
    <div className="p-6 w-full flex justify-center items-start bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl flex overflow-hidden">
        {/* ------------------ LEFT SIDEBAR ------------------ */}
        <div className="w-64 bg-gray-50 border-r p-5">
          <h2 className="text-2xl font-bold mb-1">Settings</h2>
          <p className="text-gray-500 text-sm mb-6">
            Manage Profile, Business & Security
          </p>

          <div className="flex flex-col gap-2">
            {["profile", "business", "ca", "security"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-2 rounded-md font-medium transition 
                ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-200"
                }`}
              >
                {tab === "profile" && "Profile Settings"}
                {tab === "business" && "Business Settings"}
                {tab === "ca" && "CA Settings"}
                {tab === "security" && "Security Settings"}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------ RIGHT CONTENT ------------------ */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[90vh]">
          {/* ---------- CARD WRAPPER ---------- */}
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            {/* ---------------- PROFILE TAB ---------------- */}
            {activeTab === "profile" && (
              <>
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={profile.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="Username"
                    value={profile.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={profile.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={profile.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="Alternate Phone"
                    value={profile.altPhone}
                    onChange={(e) => updateField("altPhone", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <select
                    value={profile.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="border p-3 rounded-md"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateField(
                          "photo",
                          URL.createObjectURL(e.target.files[0])
                        )
                      }
                      className="border p-3 rounded-md w-full"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ---------------- BUSINESS TAB ---------------- */}
            {activeTab === "business" && (
              <>
                <h2 className="text-xl font-bold mb-6">Business Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Business Name"
                    value={profile.businessName}
                    onChange={(e) =>
                      updateField("businessName", e.target.value)
                    }
                    className="border p-3 rounded-md"
                  />

                  <select
                    value={profile.businessType}
                    onChange={(e) =>
                      updateField("businessType", e.target.value)
                    }
                    className="border p-3 rounded-md"
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
                    onChange={(e) =>
                      updateField("businessEmail", e.target.value)
                    }
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="Business Phone"
                    value={profile.businessPhone}
                    onChange={(e) =>
                      updateField("businessPhone", e.target.value)
                    }
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="GSTIN"
                    value={profile.gstin}
                    onChange={(e) => updateField("gstin", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="PAN Number"
                    value={profile.pan}
                    onChange={(e) => updateField("pan", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="Udyam Registration No"
                    value={profile.udyam}
                    onChange={(e) => updateField("udyam", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="City"
                    value={profile.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="State"
                    value={profile.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="Pincode"
                    value={profile.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <textarea
                    placeholder="Billing Address"
                    value={profile.billingAddress}
                    onChange={(e) =>
                      updateField("billingAddress", e.target.value)
                    }
                    className="border p-3 rounded-md"
                  />

                  <textarea
                    placeholder="Shipping Address"
                    value={profile.shippingAddress}
                    onChange={(e) =>
                      updateField("shippingAddress", e.target.value)
                    }
                    className="border p-3 rounded-md"
                  />

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Business Logo
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        updateField(
                          "logo",
                          URL.createObjectURL(e.target.files[0])
                        )
                      }
                      className="border p-3 rounded-md w-full"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ---------------- CA TAB ---------------- */}
            {activeTab === "ca" && (
              <>
                <h2 className="text-xl font-bold mb-6">CA Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="CA Full Name"
                    value={profile.caName}
                    onChange={(e) => updateField("caName", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="CA Contact Number"
                    value={profile.caNumber}
                    onChange={(e) => updateField("caNumber", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="email"
                    placeholder="CA Email"
                    value={profile.caEmail}
                    onChange={(e) => updateField("caEmail", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="CA Firm Name"
                    value={profile.caFirmName}
                    onChange={(e) => updateField("caFirmName", e.target.value)}
                    className="border p-3 rounded-md"
                  />

                  <input
                    type="text"
                    placeholder="CA Certificate Number"
                    value={profile.caCertNumber}
                    onChange={(e) =>
                      updateField("caCertNumber", e.target.value)
                    }
                    className="border p-3 rounded-md"
                  />

                  <textarea
                    placeholder="CA Office Address"
                    value={profile.caAddress}
                    onChange={(e) => updateField("caAddress", e.target.value)}
                    className="border p-3 rounded-md"
                  />
                </div>
              </>
            )}

            {/* ---------------- SECURITY TAB ---------------- */}
            {activeTab === "security" && (
              <>
                <h2 className="text-xl font-bold mb-6">Password Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Current Password"
                      value={profile.password}
                      readOnly
                      className="border p-3 rounded-md w-full bg-gray-100"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border p-3 rounded-md w-full"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
                    >
                      {showNewPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* SAVE BUTTON */}
            <button
              onClick={saveProfile}
              className="mt-8 w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
