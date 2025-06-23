import api from './api';

const AUTH_URL = '/auth';

// Utility function to handle API errors consistently
const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorData = error.response.data;
    
    if (errorData.errors && Array.isArray(errorData.errors)) {
      throw errorData; // Pass the structured errors array
    } else if (errorData.message) {
      throw { message: errorData.message };
    } else if (typeof errorData === 'string') {
      throw { message: errorData };
    }
    
    // If we can't extract specific error info, include status code
    throw { message: `${defaultMessage} with status ${error.response.status}` };
  } else if (error.request) {
    // The request was made but no response was received
    console.warn('Network error details:', {
      url: error.config?.url,
      method: error.config?.method,
      timeout: error.config?.timeout
    });
    
    // Provide more helpful message based on the error
    if (error.code === 'ECONNABORTED') {
      throw { message: 'Request timed out. The server is taking too long to respond.' };
    } else if (error.message.includes('Network Error')) {
      throw { 
        message: 'Network error. Please check if the server is running and your internet connection is working.',
        details: 'The backend server might not be running. Make sure it\'s started at http://localhost:8080.'
      };
    } else {
      throw { message: 'No response from server. Please check your connection.' };
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    throw { message: error.message || defaultMessage };
  }
};

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post(`${AUTH_URL}/login`, { username, password });
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Login failed');
    }
  },

  loginWithGoogle: async (code) => {
    try {
      const response = await api.get(`/auth/google/callback?code=${code}`);
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Google login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(`${AUTH_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.role === role;
  },

  isInventoryTeam: () => {
    return authService.hasRole('INVTEAM');
  },

  isDeliveryTeam: () => {
    return authService.hasRole('DLTEAM');
  }
};

export default authService;