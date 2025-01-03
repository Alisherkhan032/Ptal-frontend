import { axiosInstance, qrAxiosInstance } from "../utils/assets";

import { BASE_URL } from "../utils/assets";

export const transactionService = {
    getTransactions: async (fromDate, toDate, team) => {
    try {
        const token = localStorage.getItem("x-access-token");
        if (token) {
        axiosInstance.defaults.headers.common["x-access-token"] = token;
        const response = await axiosInstance.get(
            `${BASE_URL}/transactions/filter`,
            {
            params: { startDate: fromDate, endDate: toDate, team: team },
            }
        );
        return response.data;
        } else {
        throw new Error("Token not available");
        }
    } catch (error) {
        throw { message: error.response?.data || "Error fetching transactions" };
    }
    }
};
