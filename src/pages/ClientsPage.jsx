import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

const ClientsPage = () => {
  const { searchQuery } = useOutletContext();

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
  const [editClientId, setEditClientId] = useState(null); // For edit

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const addOrUpdateClient = () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      alert("Please fill all fields");
      return;
    }

    if (editClientId) {
      // Update existing client
      setClients(
        clients.map((c) =>
          c.id === editClientId ? { id: editClientId, ...newClient } : c
        )
      );
    } else {
      // Add new client
      setClients([...clients, { id: Date.now(), ...newClient }]);
    }

    setNewClient({ name: "", email: "", phone: "" });
    setEditClientId(null);
    setShowModal(false);
  };

  const editClient = (client) => {
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone,
    });
    setEditClientId(client.id);
    setShowModal(true);
  };

  const deleteClient = (id) => setClients(clients.filter((c) => c.id !== id));

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Clients</h1>

      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all"
          onClick={() => {
            setShowModal(true);
            setEditClientId(null); // Reset edit
            setNewClient({ name: "", email: "", phone: "" });
          }}
        >
          + Add Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
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
                className="border-t hover:bg-gray-100 transition"
              >
                <td className="p-3">{client.name}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3 text-center">
                  <button
                    className="text-blue-600 font-semibold mr-4"
                    onClick={() => editClient(client)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 font-semibold"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Background blur */}
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/20"
            onClick={() => setShowModal(false)}
          ></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white p-6 rounded-xl shadow-2xl w-96 border"
          >
            <h2 className="text-xl font-bold mb-4">
              {editClientId ? "Edit Client" : "Add Client"}
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              className="border w-full px-3 py-2 rounded-lg mb-3"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="border w-full px-3 py-2 rounded-lg mb-3"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              className="border w-full px-3 py-2 rounded-lg mb-5"
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
                onClick={addOrUpdateClient}
              >
                {editClientId ? "Update" : "Add"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ClientsPage;
