import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Automatically inject Authorization token for all standard axios calls
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
      if (!isAuthPage) {
        console.warn('Authentication token expired or missing. Please login again.');
      }
    }
    return Promise.reject(error);
  }
);

// Pre-configured axios instance with baseURL and auth
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API_URL;
