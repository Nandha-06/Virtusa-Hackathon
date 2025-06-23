import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with base URL and configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Set timeout to prevent hanging requests
  timeout: 15000, // 15 seconds
  // Retry configuration
  retry: 1,
  retryDelay: 1000,
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle various error scenarios
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle retry logic for network errors
    if (error.message.includes('Network Error') && originalRequest.retry > 0) {
      originalRequest.retry -= 1;
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Retrying request after network error...');
          resolve(axios(originalRequest));
        }, originalRequest.retryDelay || 1000);
      });
    }
    
    // Handle specific error types
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden:', error.response.data);
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error(`Error ${error.response.status}:`, error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      // You could dispatch an action to show a connection error notification
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;