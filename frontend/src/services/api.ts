import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data);
    } else {
      console.error('API error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
