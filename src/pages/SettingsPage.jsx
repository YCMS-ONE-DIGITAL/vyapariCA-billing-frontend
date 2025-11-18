import React, { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("Ronak Tatar");
  const [email, setEmail] = useState("ronak@example.com");
  const [theme, setTheme] = useState("light");

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Profile Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Profile Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Preferences</h2>

          <label className="block text-gray-600 mb-2">Theme</label>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
              />
              Light
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
              />
              Dark
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
