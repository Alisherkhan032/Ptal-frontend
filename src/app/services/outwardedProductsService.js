import axios from "axios";
import { BASE_URL } from "../utils/assets";
import { axiosInstance } from "../utils/assets";

export const outwardedProductsService = {
    getAllOutwardedProducts: async () => {
        try {
            const token = localStorage.getItem("x-access-token");
            if (token) {
                axiosInstance.defaults.headers.common["x-access-token"] = token;
                const response = await axiosInstance.get(
                    `${BASE_URL}/getAllOutwardedProducts`
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