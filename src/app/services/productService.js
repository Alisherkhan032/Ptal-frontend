import { axiosInstance } from '../utils/assets';

import { BASE_URL } from '../utils/assets';

export const productServices = {
  getAllProductsByCatId: async (catId) => {
    const token = localStorage.getItem('x-access-token');
    if (token) {
      axiosInstance.defaults.headers.common['x-access-token'] = token;
      const response = await axiosInstance.get(
        `${BASE_URL}/getAllProductsByCatId/${catId}`
      );
      return response.data;
    } else {
      throw new Error('Token not available');
    }
  },
  catch(error) {
    throw { message: error.response.data };
  },

  getAllProducts: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.get(`${BASE_URL}/getAllProducts`);
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  createAssembyPOByPoductId: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.post(
          `${BASE_URL}/createProductPO`,
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

  getProductById: async (id) => {
    const token = localStorage.getItem('x-access-token');
    if (token) {
      axiosInstance.defaults.headers.common['x-access-token'] = token;
      const response = await axiosInstance.get(
        `${BASE_URL}/getProductsById/${id}`
      );
      return response.data;
    } else {
      throw new Error('Token not available');
    }
  },
  catch(error) {
    throw { message: error.response.data };
  },

  createNewProduct:async(data)=>{
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.post(
          `${BASE_URL}/createNewProduct`,
          data
        );
        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
            throw { message: error.response.data };

    }
        
  }
};
