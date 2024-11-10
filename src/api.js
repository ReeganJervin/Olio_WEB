// src/api.js
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'http://localhost:10008', // Replace with your API base URL
  timeout: 10000, // Optional: set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers your API might require
  },
});

// Handle response interceptor for error handling or adding tokens
api.interceptors.response.use(
  response => response,
  error => {
    // Log out or refresh tokens, if needed
    return Promise.reject(error);
  }
);

// Define CRUD methods using the axios instance
export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const putData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export default api;
