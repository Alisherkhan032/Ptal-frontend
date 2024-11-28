import { axiosInstance } from '../utils/assets';

import { BASE_URL } from '../utils/assets';

export const inventoryPOServices = {
  createInventoryPO: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.post(
          `${BASE_URL}/createInventoryPO`,
          data
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  getAllInventoryPo: async () => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.get(
          `${BASE_URL}/getAllInventoryPo`
        );

        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  getInventoryPoById: async (poId) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        console.log('called===');
        const response = await axiosInstance.get(
          `${BASE_URL}/getInventoryPoById/${poId}`
        );

        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  updateInventoryPo: async (poId, data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.patch(
          `${BASE_URL}/updateInventoryPo/${poId}`,
          data
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },
};
