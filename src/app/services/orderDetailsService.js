import axios from 'axios';
import { BASE_URL } from '../utils/assets';
import { axiosInstance } from '../utils/assets';

export const orderDetailsService = {
    getOrderDetailsByReferenceCode: async (referenceCode) => {
        try {
            const token = localStorage.getItem('x-access-token');
            if (token) {
                axiosInstance.defaults.headers.common['x-access-token'] = token;
                const response = await axiosInstance.get(`${BASE_URL}/getOrderDetailsByReferenceCode/${referenceCode}`);
                return response.data;
            } else {
                throw new Error('Token not available');
            }
        } catch (error) {
            throw { message: error.response.data };
        }
    },
 
saveOrderDetails: async (orderDetails) => {
        try {
            const token = localStorage.getItem('x-access-token');
            if (token) {
                axiosInstance.defaults.headers.common['x-access-token'] = token;
                const response = await axiosInstance.post(`${BASE_URL}/saveOrderDetails`, orderDetails);
                return response.data;
                console.log("🚀 ~ saveOrderDetails: ~ response:", response)
            } else {
                throw new Error('Token not available');
            }
        } catch (error) {
            throw { message: error.response?.data || error.message };
        }
    },

getAllOrderDetails: async () => {
        try {
            const token = localStorage.getItem('x-access-token');
            if (token) {
                axiosInstance.defaults.headers.common['x-access-token'] = token;
                const response = await axiosInstance.get(`${BASE_URL}/getAllOrderDetails`);
                return response.data;
            } else {
                throw new Error('Token not available');
            }
        } catch (error) {
            throw { message: error.response.data };
        }
    }  
};


