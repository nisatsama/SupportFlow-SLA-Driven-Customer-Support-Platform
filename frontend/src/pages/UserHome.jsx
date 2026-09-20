import { useState } from "react";
import CreateTicketForm from "../components/CreateTicketForm";
import TicketCard from "../components/TicketCard";

function UserHome() {
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  // Temporary until GET /api/tickets is implemented
  const [tickets, setTickets] = useState([]);

  const handleTicketCreated = (ticket) => {
    setTickets((previousTickets) => [ticket, ...previousTickets]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">HelpDesk</h1>

            <p className="text-xs text-gray-500">Ticket Management System</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Temporary fake logged-in user */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">John Doe</p>

              <p className="text-xs text-gray-500">User</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              J
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Tickets</h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your support requests.
            </p>
          </div>

          <button
            onClick={() => setShowCreateTicket(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Create Ticket
          </button>
        </div>

        {/* Tickets */}
        {tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No tickets yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Create your first support ticket to get started.
            </p>

            <button
              onClick={() => setShowCreateTicket(true)}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Ticket
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <CreateTicketForm
          onTicketCreated={handleTicketCreated}
          onClose={() => setShowCreateTicket(false)}
        />
      )}
    </div>
  );
}

export default UserHome;
