import axios from 'axios';
import { BASE_URL } from '../utils/assets';
import { axiosInstance } from '../utils/assets';

export const orderServices = {
  uploadCSVFile: async (formData) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': token,
          },
        };

        console.log('formData from service====', formData);
        const response = await axios.post(
          `${BASE_URL}/upload-amazon-csv`,
          formData,
          config
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response ? error.response.data : error.message };
    }
  },

  uploadCSVFileByEasyEcom: async (formData) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': token,
          },
        };

        console.log('formData from service====', formData);
        const response = await axios.post(
          `${BASE_URL}/upload-easyEcomm-csv`,
          formData,
          config
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response ? error.response.data : error.message };
    }
  },

  getAllOrders: async () => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        console.log('api called====');
        const response = await axiosInstance.get(`${BASE_URL}/getAllOrders`);
        console.log('api called====', response);
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.log('errro===', error);
    }
  },

  getAllCustomOrders: async () => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.get(`${BASE_URL}/getAllCustomOrders`);
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.log('errro===', error);
    }
  },

  createOrder: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.post(
          `${BASE_URL}/createOrder`,
          data
        );
        return response.data;
      }
    } catch (error) {
      return error.response.data;
    }
  },

  getAllOpenOrders: async () => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        console.log('api called====');
        const response = await axiosInstance.get(
          `${BASE_URL}/getAllOpenOrders`
        );
        console.log('api called====', response);
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.log('errro===', error);
    }
  },

  getOrderByOrderId: async (id) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
  
        const response = await axiosInstance.get(
          `${BASE_URL}/getOrderByOrderId`, {
            params: { id }
          }
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      return error.response.data;
    }
  },

  
  getOrderByAWBNumber: async (id) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;

        const response = await axiosInstance.get(
          `${BASE_URL}/getOrderByOrAWBNumber/${id}`
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.log('error getOrderByAWBNumber====', error);
      return error.response.data;
    }
  },

  fulfillOrderByOrderId: async (values, orderId) => { // Accept orderId as a parameter
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
  
        const response = await axiosInstance.patch(
          `${BASE_URL}/fulfillOrderByOrderId/${orderId}`, // Include orderId in the URL
          values
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.error('Error in fulfillOrderByOrderId:', error); // Log the error for debugging
      return { success: false, error: error.message || 'An error occurred' }; // Ensure to return a structured response
    }
  },

  editOrderByOrderInternalId: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
  
        const response = await axiosInstance.patch(
          `${BASE_URL}/editOrderByInternalId`, // Endpoint URL without orderInternalId in the URL
          data // Sending the entire data object in the request body
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.error('Error in editOrderByOrderInternalId:', error); // Log the error for debugging
      return { success: false, error: error.message || 'An error occurred' }; // Ensure to return a structured response
    }
  },

  deleteOrderByOrderId: async (orderInternalId) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        console.log("🚀 ~ deleteOrderByOrderId: ~ orderInternalId:", orderInternalId);
  
        const response = await axiosInstance.patch(
          `${BASE_URL}/deleteOrderById/`,
          { orderInternalId } // Correct payload format
        );
  
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.error('Error in deleteOrderByOrderId:', error);
      return error.response ? error.response.data : { success: false, error: 'Network or unexpected error occurred' };
    }
  },
  
  
  
  
};
