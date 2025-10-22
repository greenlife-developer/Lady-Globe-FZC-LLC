import axios from "axios";

// const API_URL = `http://localhost:4000/api/messages/`;
const API_URL = import.meta.env.VITE_API_URL;

// Get Orders from amazon
const getMessages = async (formData) => {
  const response = await axios.get(`${API_URL}?user=${formData.userId}&to=${formData.recipientId}`);

  return response.data;
};

const sendMessage = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data;
}

const messageService = {
  getMessages,
  sendMessage,
};

export default messageService;
