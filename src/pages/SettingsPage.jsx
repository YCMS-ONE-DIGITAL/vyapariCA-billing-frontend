// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("vyapari_profile");
      return saved
        ? JSON.parse(saved)
        : {
            name: "",
            email: "",
            phone: "",
            password: "",
            businessName: "",
            gstin: "",
            address: "",
            logo: "",
            theme: "light",
          };
    } catch {
      return {
        name: "",
        email: "",
        phone: "",
        password: "",
        businessName: "",
        gstin: "",
        address: "",
        logo: "",
        theme: "light",
      };
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const updateField = (key, value) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("logo", reader.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    localStorage.setItem("vyapari_profile", JSON.stringify(profile));
    alert("Profile updated!");
  };

  const toggleTheme = () =>
    setProfile((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));

  useEffect(() => {
    const html = document.documentElement;
    if (profile?.theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, [profile?.theme]);

  // Tailwind conditional classes
  const bgClass = profile.theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textClass =
    profile.theme === "dark" ? "text-gray-100" : "text-gray-900";
  const cardClass =
    profile.theme === "dark" ? "bg-gray-800 shadow-md" : "bg-white shadow-md";

  return (
    <div className={`p-5 min-h-screen ${bgClass} ${textClass}`}>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Theme Toggle */}
      <div className="mb-6 flex items-center gap-3">
        <span className="font-medium">Theme:</span>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
        >
          {profile?.theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Login Info Card */}
        <div className={`${cardClass} p-5 rounded-xl`}>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            Login Info
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={profile?.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={profile?.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={profile?.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={profile?.password || ""}
                onChange={(e) => updateField("password", e.target.value)}
                className="border p-2 rounded w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Business Info Card */}
        <div className={`${cardClass} p-5 rounded-xl`}>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            Business Info
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Business / Firm Name"
              value={profile?.businessName || ""}
              onChange={(e) => updateField("businessName", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="GSTIN"
              value={profile?.gstin || ""}
              onChange={(e) => updateField("gstin", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <textarea
              placeholder="Address"
              value={profile?.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <span
                  className={`px-3 py-2 rounded ${
                    profile.theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-900 border"
                  }`}
                >
                  Upload Logo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {profile?.logo && (
                <img
                  src={profile.logo}
                  alt="Logo"
                  className="w-20 h-20 object-contain border rounded"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveProfile}
          className="px-6 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
