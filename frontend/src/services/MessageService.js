import axios from "axios";

const API_URL = "http://localhost:8080/api/tickets";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getMessages = async (ticketId) => {
  const response = await axios.get(`${API_URL}/${ticketId}/messages`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const sendMessage = async (ticketId, message) => {
  const response = await axios.post(
    `${API_URL}/${ticketId}/messages`,
    {
      message,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};
