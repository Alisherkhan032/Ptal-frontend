import { axiosInstance } from "../utils/assets";

import { BASE_URL } from "../utils/assets";

export const bulkRawMaterialPOServices = {
  createBulkRawMaterialPO: async (data) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.post(
          `${BASE_URL}/createBulkRawMaterialPO`,
          data
        );
        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  getAllBulkRawMaterialPO: async () => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.get(
          `${BASE_URL}/getAllBulkRawMaterialPO`
        );

        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },
  updateBulkRawMaterialPO: async (poId, data) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.patch(
          `${BASE_URL}/updateBulkRawMaterialPO/${poId}`,
          data
        );
        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },
  
};
