import { axiosInstance } from "../utils/assets";

import { BASE_URL } from "../utils/assets";

export const categoryServices = {
  getAllCategories: async (data) => {
    try {
      const token = localStorage.getItem("x-access-token");
      if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.get(
          `${BASE_URL}/getAllCategories`
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
};
