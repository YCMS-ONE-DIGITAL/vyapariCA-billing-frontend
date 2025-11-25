// ClientsPage.jsx (Updated with LOCATION)
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const ClientsPage = () => {
  const { searchQuery } = useOutletContext();

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      location: "Pune",
      phone: "9876543210",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@gmail.com",
      location: "Mumbai",
      phone: "9876501234",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
  });

  const [editClientId, setEditClientId] = useState(null);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const addOrUpdateClient = () => {
    if (
      !newClient.name ||
      !newClient.email ||
      !newClient.location ||
      !newClient.phone
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editClientId) {
      setClients(
        clients.map((c) =>
          c.id === editClientId ? { id: editClientId, ...newClient } : c
        )
      );
    } else {
      setClients([...clients, { id: Date.now(), ...newClient }]);
    }

    setNewClient({ name: "", email: "", location: "", phone: "" });
    setEditClientId(null);
    setShowModal(false);
  };

  const editClient = (client) => {
    setNewClient({
      name: client.name,
      email: client.email,
      location: client.location,
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
      className="p-4 sm:p-6"
    >
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Clients</h1>

      <div className="flex justify-end mb-4 sm:mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md"
          onClick={() => {
            setShowModal(true);
            setEditClientId(null);
            setNewClient({ name: "", email: "", location: "", phone: "" });
          }}
        >
          + Add Client
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-200">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="p-3 text-left">Sr.No</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={client.id} className="border-t hover:bg-gray-100">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{client.name}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.location}</td>
                <td className="p-3">{client.phone}</td>

                <td className="p-3 text-center flex justify-center gap-4">
                  <button onClick={() => editClient(client)}>
                    <Pencil
                      size={20}
                      className="text-blue-600 hover:text-blue-800"
                    />
                  </button>
                  <button onClick={() => deleteClient(client.id)}>
                    <Trash2
                      size={20}
                      className="text-red-600 hover:text-red-800"
                    />
                  </button>
                </td>
              </tr>
            ))}

            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/20"
            onClick={() => setShowModal(false)}
          ></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border"
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
              placeholder="Location"
              className="border w-full px-3 py-2 rounded-lg mb-3"
              value={newClient.location}
              onChange={(e) =>
                setNewClient({ ...newClient, location: e.target.value })
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
