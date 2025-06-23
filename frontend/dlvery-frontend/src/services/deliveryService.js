import api from './api';
import authService from './authService';

const deliveryService = {
  // Inventory Team Endpoints
  createDelivery: async (deliveryData) => {
    try {
      const response = await api.post('/invteam/deliveries', deliveryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create delivery' };
    }
  },

  getAllDeliveries: async () => {
    try {
      const response = await api.get('/invteam/deliveries');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deliveries' };
    }
  },

  getDeliveryById: async (id) => {
    try {
      const endpoint = authService.isInventoryTeam() 
        ? `/invteam/deliveries/${id}` 
        : `/dlteam/deliveries/${id}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch delivery' };
    }
  },

  getDeliveriesByAgentId: async (agentId) => {
    try {
      const response = await api.get(`/invteam/deliveries/agent/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deliveries' };
    }
  },

  getDeliveriesByStatus: async (status) => {
    try {
      const response = await api.get(`/invteam/deliveries/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deliveries' };
    }
  },

  // Delivery Team Endpoints
  getMyDeliveries: async () => {
    try {
      const response = await api.get('/dlteam/deliveries/my');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deliveries' };
    }
  },

  getMyTodayDeliveries: async () => {
    try {
      const response = await api.get('/dlteam/deliveries/my/today');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch today\'s deliveries' };
    }
  },

  getMyPendingDeliveries: async () => {
    try {
      const response = await api.get('/dlteam/deliveries/my/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending deliveries' };
    }
  },

  completeDelivery: async (id, data) => {
    try {
      const response = await api.put(`/dlteam/deliveries/${id}/complete`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to complete delivery' };
    }
  },

  markAsDoorLock: async (id, notes) => {
    try {
      const response = await api.put(`/dlteam/deliveries/${id}/door-lock`, { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark delivery as door lock' };
    }
  },

  updateDeliveryStatus: async (id, data) => {
    try {
      // Use the appropriate endpoint based on user role
      const endpoint = authService.isInventoryTeam()
        ? `/invteam/deliveries/${id}/status`
        : `/dlteam/deliveries/${id}/status`;
      
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update delivery status' };
    }
  },

  updateDeliveryItems: async (id, items) => {
    try {
      // Use the appropriate endpoint based on user role
      const endpoint = authService.isInventoryTeam()
        ? `/invteam/deliveries/${id}/items`
        : `/dlteam/deliveries/${id}/items`;
        
      const response = await api.put(endpoint, items);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update delivery items' };
    }
  },
  
  // Additional delivery agent specific functions
  reportDamage: async (id, data) => {
    try {
      const response = await api.put(`/dlteam/deliveries/${id}/status`, {
        status: 'DAMAGED',
        ...data
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to report damage' };
    }
  },
  
  returnDelivery: async (id, data) => {
    try {
      const response = await api.put(`/dlteam/deliveries/${id}/status`, {
        status: 'RETURNED',
        ...data
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to return delivery' };
    }
  },
  
  // Get deliveries with damaged items
  getDamagedDeliveries: async () => {
    try {
      const response = await api.get('/invteam/deliveries/damaged');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch damaged deliveries' };
    }
  },
  
  // Get deliveries by date range
  getDeliveriesByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get('/invteam/deliveries/date-range', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deliveries by date range' };
    }
  },

  startDelivery: async (id) => {
    try {
      const response = await api.put(`/dlteam/deliveries/${id}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to start delivery' };
    }
  },

  updateDeliveryStatus: async (id, status, details) => {
    try {
      const response = await api.put(`/dlteam/deliveries/${id}/status`, { status, ...details });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update delivery status' };
    }
  }
};

export default deliveryService;