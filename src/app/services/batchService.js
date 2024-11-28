import { axiosInstance } from "../utils/assets";

import { BASE_URL } from "../utils/assets";

export const batchServices = {
  getAllBatches: async (raw_material_id) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;

        const response = await axiosInstance.get(
          `${BASE_URL}/getRawMaterialPoBatchById/${raw_material_id}`
        );
        console.log(
          "response from getAllCategories service=====",
          response.data
        );
        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  getBatchTransformedData: async (raw_material_id) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;

        const response = await axiosInstance.get(
          `${BASE_URL}/getBatchInfoByRawMatertialId/${raw_material_id}`
        );
        console.log(
          "response from getAllCategories service=====",
          response.data
        );
        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },
 
  
  getBatchInfoBySKUCode: async (skuCodes) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        // Set the token in the headers
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        console.log("🚀 ~ getBatchInfoBySKUCode: ~ skuCodes:", skuCodes)
        // Make a POST request to get batch information by SKU codes
        const response = await axiosInstance.post(
          `${BASE_URL}/getBatchInfoBySKUCode`,
          {
            skuCodes,
          }
        );
            console.log("🚀 ~ getBatchInfoBySKUCode: ~ skuCodes:", skuCodes)
  
        console.log(
          "response from getBatchInfoBySKUCode service=====",
          response.data
        );
  
        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      console.error("Error in getBatchInfoBySKUCode service:", error);
      throw { message: error.response?.data || "An error occurred" };
    }
  },
  
  getBatchNumberByPoId: async (po_id) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.get(
          `${BASE_URL}/getBatchNumberByPoId/${po_id}`
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
