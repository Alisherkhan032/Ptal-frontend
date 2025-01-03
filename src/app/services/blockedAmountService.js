    import { BASE_URL } from "../utils/assets";
    import { axiosInstance } from "../utils/assets";

    export const fetchBlockedAmounts = async () => {
      try {
        const token = localStorage.getItem("x-access-token");
        if (token) {
          // console.log("Token available 🙌🙌🙌🙌");
          axiosInstance.defaults.headers.common["x-access-token"] = token;
          const response = await axiosInstance.get(`${BASE_URL}/blocked-amount`);
          return response.data;
        } else {
          throw new Error("Token not available");
        }
      } catch (error) {
        console.error("Error fetching blocked amounts:", error);
        throw new Error("Failed to fetch blocked amounts");
      }
    };
