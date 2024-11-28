import { axiosInstance } from "../utils/assets";

import { BASE_URL } from "../utils/assets";

export const rawMaterialServices = {
  getAllRawMaterials: async (data) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.get(
          `${BASE_URL}/getAllRawMaterials`
        );

        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  getAllRawMaterialsByCatId: async (catId) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.get(
          `${BASE_URL}/getRawMaterialByCatId/${catId}`
        );
        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  checkRawMaterialStock: async (data) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.post(
          `${BASE_URL}/checkRawMaterialQuantity`,
          data
        );
        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      return error.response.data;
    }
  },

  createRawMaterial:async(data)=>{
     try {
       const token = localStorage.getItem("x-access-token");
       if (token) {
         axiosInstance.defaults.headers.common["x-access-token"] = token;
         const response = await axiosInstance.post(
           `${BASE_URL}/creatRawMaterial`,
           data
         );
         return response.data;
       } else {
         throw new Error("Token not available");
       }
     } catch (error) {
       return error.response.data;
     }
  },


  getSkuCodeById: async (id) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.get(
          `${BASE_URL}/getSkuCodeById/${id}`
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
