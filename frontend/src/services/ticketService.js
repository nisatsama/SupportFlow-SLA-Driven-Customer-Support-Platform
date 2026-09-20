import api from "../api/axios";

export const getTickets = () => {
  return api.get("/tickets");
};

export const getTicketById = (id) => {
  return api.get(`/tickets/${id}`);
};

export const createTicket = (ticketData) => {
  return api.post("/tickets", ticketData);
};

export const updateTicket = (id, ticketData) => {
  return api.put(`/tickets/${id}`, ticketData);
};

export const deleteTicket = (id) => {
  return api.delete(`/tickets/${id}`);
};
