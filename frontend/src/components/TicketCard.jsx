import axios from "axios";
import { useNavigate } from "react-router-dom";

function TicketCard({ ticket, onDelete }) {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/tickets/${ticket.id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/tickets/${ticket.id}`);

      // Remove deleted ticket from parent state
      if (onDelete) {
        onDelete(ticket.id);
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Failed to delete ticket.");
    }
  };

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">{ticket.title}</h3>

          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {ticket.description}
          </p>
        </div>

        {/* Status */}
        <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
          {ticket.status}
        </span>
      </div>

      {/* Ticket Information */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500">
        <span>
          <strong className="text-gray-700">Priority:</strong> {ticket.priority}
        </span>

        <span>
          <strong className="text-gray-700">Category:</strong> {ticket.category}
        </span>

        <span>
          <strong className="text-gray-700">Created By:</strong>{" "}
          {ticket.createdByName || `User #${ticket.createdById}`}
        </span>

        <span>
          <strong className="text-gray-700">Assigned To:</strong>{" "}
          {ticket.assignedToName || "Unassigned"}
        </span>

        <span>
          <strong className="text-gray-700">Deadline:</strong>{" "}
          {ticket.deadline
            ? new Date(ticket.deadline).toLocaleString()
            : "No deadline"}
        </span>

        <span>
          <strong className="text-gray-700">Created:</strong>{" "}
          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "-"}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
        <span>Ticket #{ticket.id}</span>

        <span>
          Updated:{" "}
          {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : "-"}
        </span>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
