import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TicketDetails.css";

const TicketDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH TICKET USING ID
  // ==========================================
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:3000/api/tickets/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch ticket");
        }

        // Depending on your controller response
        // If backend returns { ticket: {...} }
        setTicket(data.ticket || data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  // ==========================================
  // STATUS CLASS
  // ==========================================
  const getStatusClass = (status) => {
    return status?.toLowerCase().replace(" ", "-") || "";
  };

  // ==========================================
  // PRIORITY CLASS
  // ==========================================
  const getPriorityClass = (priority) => {
    return priority?.toLowerCase() || "";
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="ticket-details-page">
        <div className="loading-message">Loading ticket details...</div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="ticket-details-page">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/tickets")}
        >
          ← Back to My Tickets
        </button>

        <div className="error-message">
          <h2>Unable to load ticket</h2>
          <p>{error}</p>

          <button
            onClick={() => navigate("/dashboard/tickets")}
            className="back-to-tickets-button"
          >
            Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TICKET NOT FOUND
  // ==========================================
  if (!ticket) {
    return (
      <div className="ticket-details-page">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/tickets")}
        >
          ← Back to My Tickets
        </button>

        <div className="error-message">
          <h2>Ticket not found</h2>
          <p>The ticket you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="ticket-details-page">
      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => navigate("/dashboard/tickets")}
      >
        ← Back to My Tickets
      </button>

      {/* Main Ticket Card */}
      <div className="ticket-details-card">
        {/* Header */}
        <div className="ticket-header">
          <div>
            <h1>{ticket.title}</h1>

            <p className="ticket-id">Ticket #{ticket._id}</p>
          </div>

          <span className={`status-badge ${getStatusClass(ticket.status)}`}>
            {ticket.status?.toUpperCase()}
          </span>
        </div>

        {/* Ticket Information */}
        <div className="ticket-info-grid">
          {/* Department */}
          <div className="info-item">
            <span className="info-label">Department</span>

            <span className="info-value">
              {ticket.department || "Not assigned"}
            </span>
          </div>

          {/* Priority */}
          <div className="info-item">
            <span className="info-label">Priority</span>

            <span
              className={`priority-value ${getPriorityClass(ticket.priority)}`}
            >
              {ticket.priority || "Not specified"}
            </span>
          </div>

          {/* Created */}
          <div className="info-item">
            <span className="info-label">Created</span>

            <span className="info-value">{formatDate(ticket.createdAt)}</span>
          </div>
        </div>

        {/* Description */}
        <section className="ticket-section">
          <h2>Description</h2>

          <div className="section-divider"></div>

          <p className="description">{ticket.description}</p>
        </section>

        {/* Attachments */}
        <section className="ticket-section">
          <h2>Attachments</h2>

          <div className="section-divider"></div>

          {!ticket.attachments || ticket.attachments.length === 0 ? (
            <p className="empty-message">No attachments yet</p>
          ) : (
            <div className="attachments-list">
              {ticket.attachments.map((file, index) => (
                <div className="attachment-item" key={file._id || index}>
                  📎 {file.name || file.filename}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Conversation */}
        <section className="ticket-section">
          <h2>Conversation</h2>

          <div className="section-divider"></div>

          {!ticket.replies || ticket.replies.length === 0 ? (
            <div className="empty-conversation">
              <div className="conversation-icon">💬</div>

              <p>No replies yet</p>

              <span>Your support conversation will appear here.</span>
            </div>
          ) : (
            <div className="conversation-list">
              {ticket.replies.map((reply, index) => (
                <div className="reply-card" key={reply._id || index}>
                  <div className="reply-header">
                    <strong>
                      {reply.sender || reply.createdBy?.name || "Support"}
                    </strong>

                    <span>{formatDate(reply.createdAt)}</span>
                  </div>

                  <p>{reply.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reply Button */}
        <div className="reply-section">
          <button
            className="reply-button"
            onClick={() => {
              alert("Reply feature coming next!");
            }}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
