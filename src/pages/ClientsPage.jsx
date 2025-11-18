import React, { useState } from "react";
import { motion } from "framer-motion";

const ClientsPage = () => {
  // ------------------ STATE ------------------
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9876543210",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@gmail.com",
      phone: "9876501234",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ------------------ FUNCTIONS ------------------

  // Add Client
  const addClient = () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      alert("Please fill all fields");
      return;
    }

    setClients([...clients, { id: Date.now(), ...newClient }]);

    setNewClient({ name: "", email: "", phone: "" });
    setShowModal(false);
  };

  // Delete Client
  const deleteClient = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  // Filter Search
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-4 text-gray-700 dark:text-white">
        Clients
      </h1>

      {/* ------------------ TOP BAR ------------------ */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search client..."
          className="border px-3 py-2 rounded-lg w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          + Add Client
        </button>
      </div>

      {/* ------------------ TABLE ------------------ */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800">
        <table className="w-full">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="border-t hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-3">{client.name}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3 text-center">
                  <button className="text-blue-600 mr-4">Edit</button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteClient(client.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------ ADD CLIENT MODAL ------------------ */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-96"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
              Add Client
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              className="border px-3 py-2 rounded-lg w-full mb-3"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="border px-3 py-2 rounded-lg w-full mb-3"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              className="border px-3 py-2 rounded-lg w-full mb-4"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
            />

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={addClient}
              >
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ClientsPage;
