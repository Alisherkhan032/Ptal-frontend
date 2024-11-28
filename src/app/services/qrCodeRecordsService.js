import { axiosInstance } from '../utils/assets';
import { BASE_URL } from '../utils/assets';

export const qrCodeRecordsServices = {
  getAllQrCodeRecords: async () => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.get(`${BASE_URL}/getAllQRCodeRecords`);
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response };
    }
  },

  updateQRCodeStatuses: async (qrCodes) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        const response = await axiosInstance.post(`${BASE_URL}/updateQRCodeStatus`, qrCodes);
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },
  streamQrCodeRecords: async (onData) => {
    try {
      const token = localStorage.getItem('x-access-token');
      console.log("Token Retrieved:", token); // Log the token
      if (token) {
  
        console.log("Attempting to establish streaming connection...");

        const eventSource = new EventSource(`${BASE_URL}/streamQRCodeRecords`);

        eventSource.onmessage = (event) => {

            const parsedData = JSON.parse(event.data);

            onData(parsedData);
        };
        eventSource.onerror = (error) => {
          console.error("EventSource failed:", error); // Log the error
          eventSource.close(); // Close the connection
        }
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.error("Streaming Error:", error); // Log the error
      throw { message: error.response?.data || error.message };
    }
  },
  
};
