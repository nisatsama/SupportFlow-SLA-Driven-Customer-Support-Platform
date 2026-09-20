import { useEffect, useState } from "react";
import CreateTicketForm from "../components/CreateTicketForm";
import TicketCard from "../components/TicketCard";
//import ticketService from "../services/ticketService";
import { getTickets } from "../services/ticketService";
function UserHome() {
  const [tickets, setTickets] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTickets();

      setTickets(response.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketCreated = (newTicket) => {
    setTickets((previousTickets) => [newTicket, ...previousTickets]);

    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">HelpDesk</h1>

            <p className="text-sm text-gray-500">Ticket Management System</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, User</span>

            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Tickets</h2>

            <p className="text-gray-500 mt-1">
              Create and manage your support tickets.
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            + Create Ticket
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-gray-500">
            Loading tickets...
          </div>
        )}

        {/* Empty state */}
        {!loading && tickets.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No tickets yet
            </h3>

            <p className="text-gray-500 mt-2">
              Create your first support ticket.
            </p>

            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Ticket
            </button>
          </div>
        )}

        {/* Tickets */}
        {!loading && tickets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>

      {/* Create Ticket Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-2xl">
            <CreateTicketForm
              onTicketCreated={handleTicketCreated}
              onClose={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHome;
