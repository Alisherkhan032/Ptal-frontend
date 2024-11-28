import { axiosInstance } from "../utils/assets";

import { BASE_URL } from "../utils/assets";

export const vendorServices = {
  getAllVendors: async () => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.get(`${BASE_URL}/getAllVendors`);
        console.log("response from allvendors service=====", response.data);

        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },
  createNewVendor:async(data)=>{
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.post(`${BASE_URL}/createVendor`,data);
        console.log("response from createVendor service=====", response.data);

        return response.data;
      } else {
        throw new Error("Token not available");
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  }
};
