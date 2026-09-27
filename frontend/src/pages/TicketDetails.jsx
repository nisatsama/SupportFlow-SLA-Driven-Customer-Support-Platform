import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getMessages, sendMessage } from "../services/MessageService";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Messages
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(true);

  /*
   * Get logged-in user's role from JWT
   */
  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      console.log("JWT Payload:", payload);

      role =
        payload.role ||
        payload.roles ||
        payload.authority ||
        payload.authorities?.[0] ||
        null;

      console.log("Detected role:", role);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }

  const normalizedRole = role?.toString().toUpperCase();

  const isAdmin = normalizedRole === "ADMIN" || normalizedRole === "ROLE_ADMIN";

  console.log("Is Admin:", isAdmin);

  /*
   * Fetch ticket details
   */
  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:8080/api/tickets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setTicket(response.data);
    } catch (error) {
      console.error("Error fetching ticket:", error);

      setError(
        error.response?.data?.message || "Failed to load ticket details.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Fetch ticket messages
   */
  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);

      const data = await getMessages(id);

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);

      // Don't destroy the whole ticket page if messages fail.
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  /*
   * Fetch ticket + messages
   */
  useEffect(() => {
    fetchTicket();
    fetchMessages();
  }, [id]);

  /*
   * Change ticket status - ADMIN ONLY
   */
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (!ticket) return;

    try {
      const response = await axios.patch(
        `http://localhost:8080/api/tickets/${ticket.id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setTicket(response.data);

      console.log("Status updated:", response.data.status);
    } catch (error) {
      console.error("Error updating ticket status:", error);

      alert(error.response?.data?.message || "Failed to update ticket status.");
    }
  };

  /*
   * Send a new message
   */
  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();

    if (!trimmedMessage || sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);

      const message = await sendMessage(id, trimmedMessage);

      // Add newly created message immediately
      setMessages((prev) => [...prev, message]);

      // Clear input
      setNewMessage("");

      // Important:
      // If a USER replied to a RESOLVED ticket,
      // backend may have changed status to OPEN.
      await fetchTicket();
    } catch (error) {
      console.error("Error sending message:", error);

      alert(error.response?.data?.message || "Failed to send message.");
    } finally {
      setSendingMessage(false);
    }
  };

  /*
   * Allow Enter to send message
   * Shift + Enter creates a new line
   */
  const handleMessageKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /*
   * Delete ticket
   */
  const handleDelete = async () => {
    if (!ticket) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/tickets/${ticket.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/user-home");
    } catch (error) {
      console.error("Error deleting ticket:", error);

      alert(error.response?.data?.message || "Failed to delete ticket.");
    }
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading ticket...</p>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={() => navigate("/user-home")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  /*
   * Ticket not found
   */
  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Ticket not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/user-home")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >
          <span className="text-lg">←</span>
          Back to Tickets
        </button>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  {ticket.title}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Ticket #{ticket.id}
                </p>
              </div>

              {/* STATUS */}
              {isAdmin ? (
                <select
                  value={ticket.status}
                  onChange={handleStatusChange}
                  className="w-fit rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="OPEN">OPEN</option>

                  <option value="IN_PROGRESS">IN_PROGRESS</option>

                  <option value="ON_HOLD">ON_HOLD</option>

                  <option value="RESOLVED">RESOLVED</option>

                  <option value="CLOSED">CLOSED</option>
                </select>
              ) : (
                <span className="w-fit rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-yellow-700">
                  {ticket.status}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {ticket.description}
            </p>
          </div>

          {/* Attachment */}
          {ticket.imageUrl && (
            <div className="border-t border-gray-100 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Attachment
              </h2>

              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <img
                  src={ticket.imageUrl}
                  alt={`Attachment for ${ticket.title}`}
                  className="max-h-[500px] w-full object-contain"
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">Ticket attachment</p>
            </div>
          )}

          {/* Ticket Information */}
          <div className="border-t border-gray-100 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Ticket Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Priority */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Priority
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {ticket.priority || "-"}
                </p>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Category
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {ticket.category || "-"}
                </p>
              </div>

              {/* Room No */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Room No.
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {ticket.roomNo || "-"}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Status
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {ticket.status || "-"}
                </p>
              </div>

              {/* Deadline */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Deadline
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {ticket.deadline
                    ? new Date(ticket.deadline).toLocaleString()
                    : "No deadline"}
                </p>
              </div>

              {/* Created By */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Created By
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {ticket.createdByName || `User #${ticket.createdById}`}
                </p>
              </div>

              {/* Created */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Created
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              {/* Last Updated */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-400">
                  Last Updated
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {ticket.updatedAt
                    ? new Date(ticket.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* CONVERSATION */}
          {/* ================================================= */}

          <div className="border-t border-gray-100 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Conversation
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Communicate with the support team about this ticket.
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[450px] space-y-4 overflow-y-auto rounded-xl bg-gray-50 p-4">
              {messagesLoading ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">No messages yet.</p>

                  <p className="mt-1 text-xs text-gray-400">
                    Send a message to start the conversation.
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isUser =
                    message.senderRole === "USER" ||
                    message.senderRole === "ROLE_USER";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isUser ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          isUser
                            ? "rounded-bl-md bg-white text-gray-800 shadow-sm"
                            : "rounded-br-md bg-blue-600 text-white"
                        }`}
                      >
                        {/* Sender */}
                        <div
                          className={`mb-1 text-xs font-semibold ${
                            isUser ? "text-gray-500" : "text-blue-100"
                          }`}
                        >
                          {message.senderName || (isUser ? "User" : "Admin")}
                        </div>

                        {/* Message */}
                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.message}
                        </p>

                        {/* Time */}
                        <p
                          className={`mt-2 text-[10px] ${
                            isUser ? "text-gray-400" : "text-blue-100"
                          }`}
                        >
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="mt-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleMessageKeyDown}
                placeholder="Type a message..."
                rows={3}
                disabled={sendingMessage}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />

              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Press Enter to send. Shift + Enter for a new line.
                </p>

                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !newMessage.trim()}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sendingMessage ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 p-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete Ticket
            </button>

            <button
              type="button"
              onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Edit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
