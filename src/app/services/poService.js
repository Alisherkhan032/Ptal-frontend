import { axiosInstance, qrAxiosInstance } from '../utils/assets';

import { BASE_URL } from '../utils/assets';

export const poServices = {
  getAllPo: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.get(`${BASE_URL}/getAllPO`);

        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  getAllPoAfter26Nov : async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.get(`${BASE_URL}/getAllPOAfter26Nov2024`);

        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  createPO: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.post(
          `${BASE_URL}/createNewPO`,
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

  createPOFromRTOOrder: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.post(
          `${BASE_URL}/createNewPOFromRTO`,
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


  updateQcInfo: async (poId, data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.patch(
          `${BASE_URL}/updateQcInfo/${poId}`,
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

  getPoById: async (poId) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.get(
          `${BASE_URL}/getPoById/${poId}`
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  updatePoStatus: async (poId, data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.patch(
          `${BASE_URL}/updatePO/${poId}`
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  generateBatchSticker: async (id) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        qrAxiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await qrAxiosInstance.post(
          `${BASE_URL}/generateBatchSticker/${id}`
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
