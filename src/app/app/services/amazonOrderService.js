import axios from 'axios';
import { BASE_URL } from '../utils/assets';
import { axiosInstance } from '../utils/assets';

export const amazonOrderService = {
    uploadAmazonCSV: async (file) => {
        try {
            const token = localStorage.getItem('x-access-token');
            if (!token) {
                throw new Error('Token not available');
            }

            // Set the token in headers for authorization
            axiosInstance.defaults.headers.common['x-access-token'] = token;

            // Create FormData to send the file
            const formData = new FormData();
            formData.append('file', file);

            // Make the POST request to upload the file
            const response = await axiosInstance.post(`${BASE_URL}/uploadAmazonCSV`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error uploading CSV file:", error);
            throw {
                message: error.response?.data?.message || "Failed to upload CSV file",
            };
        }
    },



    getAmazonOrderById: async (orderId) => {
        try {
            const token = localStorage.getItem('x-access-token');
            if (!token) {
                throw new Error('Token not available');
            }

            // Set the token in headers for authorization
            axiosInstance.defaults.headers.common['x-access-token'] = token;

            // Make the GET request to fetch order details by orderId
            const response = await axiosInstance.get(`${BASE_URL}/amazonOrders/${orderId}`);

            return response.data; // This will return the data (order details)
        } catch (error) {
            console.error("Error fetching Amazon order details:", error);
            throw {
                message: error.response?.data?.message || "Failed to fetch order details",
            };
        }
    },

    updateAmazonOrder: async (requestBody) => {
        try {
            const token = localStorage.getItem('x-access-token');
            if (!token) {
                throw new Error('Token not available');
            }

            // Set the token in headers for authorization
            axiosInstance.defaults.headers.common['x-access-token'] = token;

            // Make the PUT request to update the order
            const response = await axiosInstance.put(`${BASE_URL}/updateAmazonOrders`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data; // This will return the updated order data
        } catch (error) {
            console.error("Error updating Amazon order:", error);
            throw {
                message: error.response?.data?.message || "Failed to update order",
            };
        }
    },
};
