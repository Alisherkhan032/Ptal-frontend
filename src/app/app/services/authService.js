import { axiosInstance } from "../utils/assets";

import { BASE_URL } from "../utils/assets";

export const authServices = {
  siginUser: async (data) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/signin`, data);
      console.log("response from authService=====", response.data);

      return response.data;
    } catch (error) {
      console.log("error===", error);
      return error.response.data;
    }
  },
};
