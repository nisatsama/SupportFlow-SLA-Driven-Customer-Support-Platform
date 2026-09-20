import { useNavigate } from "react-router-dom";

function TicketCard({ ticket }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="w-full rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">{ticket.title}</h3>

          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {ticket.description}
          </p>
        </div>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
          {ticket.status}
        </span>
      </div>

      <div className="mt-4 flex gap-4 text-xs text-gray-500">
        <span>Priority: {ticket.priority}</span>

        <span>Department: {ticket.department}</span>
      </div>
    </button>
  );
}

export default TicketCard;
