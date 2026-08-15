import { useEffect, useState } from "react";
import "./UserDashboard.css";
const UserDashboard = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchingTickets, setFetchingTickets] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Ticket form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    priority: "medium",
  });

  // Attachment state
  const [attachment, setAttachment] = useState(null);

  // ==========================================
  // GET JWT
  // ==========================================

  const token = localStorage.getItem("token");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE FILE CHANGE
  // ==========================================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setAttachment(null);
      return;
    }

    setAttachment(file);
  };

  // ==========================================
  // FETCH USER'S TICKETS
  // GET /api/tickets
  // ==========================================

  const fetchTickets = async () => {
    try {
      setFetchingTickets(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tickets");
      }

      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Fetch tickets error:", error);
      setError(error.message);
    } finally {
      setFetchingTickets(false);
    }
  };

  // ==========================================
  // FETCH TICKETS WHEN DASHBOARD LOADS
  // ==========================================

  useEffect(() => {
    fetchTickets();
  }, []);

  // ==========================================
  // CREATE TICKET
  // POST /api/tickets
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic frontend validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.department
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          department: formData.department,
          priority: formData.priority,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create ticket");
      }

      // Add newly created ticket to UI
      setTickets((prev) => [data.ticket, ...prev]);

      // Success message
      setSuccess("Ticket created successfully! 🎫");

      // Reset form
      setFormData({
        title: "",
        description: "",
        department: "",
        priority: "medium",
      });

      setAttachment(null);

      // Close form
      setShowCreateForm(false);
    } catch (error) {
      console.error("Create ticket error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  // ==========================================
  // CALCULATE DASHBOARD STATS
  // ==========================================

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in-progress",
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved" || ticket.status === "closed",
  ).length;

  // ==========================================
  // RETURN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">HelpoMania</h1>

          <p className="text-sm text-gray-500">User Dashboard</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome back 👋</h2>

          <p className="text-gray-500 mt-2">
            Manage your support requests and track your tickets.
          </p>
        </div>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* ======================================
            STATISTICS
        ====================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total */}

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Tickets</p>

            <h3 className="text-3xl font-bold text-gray-800 mt-2">
              {totalTickets}
            </h3>
          </div>

          {/* Open */}

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Open</p>

            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {openTickets}
            </h3>
          </div>

          {/* In Progress */}

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">In Progress</p>

            <h3 className="text-3xl font-bold text-yellow-600 mt-2">
              {inProgressTickets}
            </h3>
          </div>

          {/* Resolved */}

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Resolved</p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {resolvedTickets}
            </h3>
          </div>
        </div>

        {/* ======================================
            CREATE TICKET BUTTON
        ====================================== */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Tickets</h2>

          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setError("");
              setSuccess("");
            }}
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {showCreateForm ? "Cancel" : "+ Create Ticket"}
          </button>
        </div>

        {/* ======================================
            CREATE TICKET FORM
        ====================================== */}

        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Create a New Support Ticket
            </h2>

            <form onSubmit={handleSubmit}>
              {/* TITLE */}

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your problem title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your problem in detail..."
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                />
              </div>

              {/* DEPARTMENT */}

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Department</option>

                  <option value="technical">Technical Support</option>

                  <option value="billing">Billing</option>

                  <option value="account">Account Support</option>

                  <option value="general">General Support</option>
                </select>
              </div>

              {/* PRIORITY */}

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>

                  <option value="medium">Medium</option>

                  <option value="high">High</option>

                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* FILE UPLOAD */}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Screenshot / Image / Video
                </label>

                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                />

                {attachment && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected file:{" "}
                    <span className="font-medium">{attachment.name}</span>
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  Attachment upload will be connected to the backend later.
                </p>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-gray-400"
              >
                {loading ? "Creating Ticket..." : "Create Ticket"}
              </button>
            </form>
          </div>
        )}

        {/* ======================================
            TICKETS
        ====================================== */}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {fetchingTickets ? (
            <div className="p-8 text-center text-gray-500">
              Loading your tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-5xl mb-4">🎫</div>

              <h3 className="text-xl font-semibold text-gray-800">
                No tickets yet
              </h3>

              <p className="text-gray-500 mt-2">
                Create your first support ticket when you need help.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Title
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Department
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Priority
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {/* TITLE */}

                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">
                          {ticket.title}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          #{ticket._id.slice(-6)}
                        </p>
                      </td>

                      {/* DEPARTMENT */}

                      <td className="px-6 py-4 text-gray-600 capitalize">
                        {ticket.department}
                      </td>

                      {/* PRIORITY */}

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                          
                          ${
                            ticket.priority === "low"
                              ? "bg-green-100 text-green-700"
                              : ticket.priority === "medium"
                                ? "bg-blue-100 text-blue-700"
                                : ticket.priority === "high"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                          }
                          `}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize

                          ${
                            ticket.status === "open"
                              ? "bg-blue-100 text-blue-700"
                              : ticket.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : ticket.status === "resolved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                          }

                          `}
                        >
                          {ticket.status.replace("-", " ")}
                        </span>
                      </td>

                      {/* CREATED DATE */}

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
