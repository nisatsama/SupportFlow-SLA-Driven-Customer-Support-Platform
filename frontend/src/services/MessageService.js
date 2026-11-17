import api from "../api/axios";

export const getMessages = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}/messages`);

  return response.data;
};

export const sendMessage = async (ticketId, message) => {
  const response = await api.post(`/tickets/${ticketId}/messages`, {
    message,
  });

  return response.data;
};
