import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/subscriptions'; // Assuming your backend runs on port 5000

const api = {
  get: async (path = '') => {
    try {
      const response = await axios.get(`${API_URL}${path}`);
      return response.data;
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  post: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  },
};

export default api;
