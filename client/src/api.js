import axios from 'axios';

// In Create React App, variables must start with REACT_APP_ to be bundled in the browser.
// We support REACT_APP_API_URL, REACT_APP_APP_URL, APP_URL, and fallback to http://localhost:4000
const resolveApiUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (process.env.REACT_APP_APP_URL) return process.env.REACT_APP_APP_URL;
  if (process.env.APP_URL && process.env.APP_URL.startsWith('http')) return process.env.APP_URL;
  return 'http://localhost:4000';
};

export const API_URL = resolveApiUrl().replace(/\/+$/, '');

// Automatically inject Authorization token and sanitize URLs for all axios calls
axios.interceptors.request.use(
  (config) => {
    // If URL mistakenly had "undefined/" prefix, fix it automatically
    if (config.url && config.url.startsWith('undefined/')) {
      config.url = config.url.replace('undefined/', `${API_URL}/`);
    } else if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/')) {
      config.url = `${API_URL}/${config.url}`;
    }

    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated responses and automatic port retry
axios.interceptors.response.use(
  (response) => {
    // Detect if HTML was returned instead of JSON (e.g. dev server fallback)
    if (
      typeof response.data === 'string' &&
      response.data.trim().startsWith('<!DOCTYPE') &&
      response.config.url &&
      (response.config.url.includes('/auth/') || response.config.url.includes('/org') || response.config.url.includes('/donor') || response.config.url.includes('/volunteer') || response.config.url.includes('/admin'))
    ) {
      return Promise.reject(new Error('Backend server unreachable. Make sure "node server.js" is running on port 4000.'));
    }
    return response;
  },
  async (error) => {
    // If connection refused on 4000, try 4001; if on 4001, try 4000
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      const originalRequest = error.config;
      if (originalRequest && !originalRequest._retryPort) {
        originalRequest._retryPort = true;
        const currentUrl = originalRequest.url;
        if (currentUrl && currentUrl.includes(':4000')) {
          originalRequest.url = currentUrl.replace(':4000', ':4001');
          return axios(originalRequest);
        } else if (currentUrl && currentUrl.includes(':4001')) {
          originalRequest.url = currentUrl.replace(':4001', ':4000');
          return axios(originalRequest);
        }
      }
    }

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
