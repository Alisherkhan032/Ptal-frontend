import axios from 'axios';
import { BASE_URL } from '../utils/assets';
import { axiosInstance } from '../utils/assets';

export const engravingOrderServices = {
  createEngravingOrder: async (data) => {
    try {
      // Retrieve the authentication token from local storage
      const token = localStorage.getItem('x-access-token');

      if (token) {
        // Set the token in the axios instance headers
        axiosInstance.defaults.headers.common['x-access-token'] = token;

        // Send a POST request to the backend to create an engraving order
        const response = await axiosInstance.post(
          `${BASE_URL}/createEngravingOrder`,
          data
        );

        // Return the response data from the API
        return response.data;
      } else {
        // Throw an error if the token is not available
        throw new Error('Token not available');
      }
    } catch (error) {
      // Handle errors and return them in a structured format
      console.error('Error in createEngravingOrder:', error);
      return {
        success: false,
        message: error.response ? error.response.data : error.message,
      };
    }
  },

  getAllEngravingOrders: async () => {
    try{
        const token = localStorage.getItem('x-access-token');
        if (token) {
            axiosInstance.defaults.headers.common['x-access-token'] = token;
            const response = await axiosInstance.get(`${BASE_URL}/getAllEngravingOrders`);
            return response.data;
        } else {
            throw new Error('Token not available');
        }
    } catch (error) {
        console.log('error===', error);
    }
},

processEngravingOrderQRCodes: async (qrCodes) => {
  try {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('x-access-token');

    if (token) {
      // Set the token in the axios instance headers
      axiosInstance.defaults.headers.common['x-access-token'] = token;

      // Send a POST request to the backend to process the QR codes
      const response = await axiosInstance.post(
        `${BASE_URL}/processEngravingOrderQRCodes`,
        qrCodes
      );

      // Return the response data from the API
      return response.data;
    } else {
      // Throw an error if the token is not available
      throw new Error('Token not available');
    }
  } catch (error) {
    // Handle errors and return them in a structured format
    console.error('Error in processEngravingOrderQRCodes:', error);
    return {
      success: false,
      message: error.response ? error.response.data : error.message,
    };
  }
},
getEngravingInventoryLevels: async () => {
  try {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('x-access-token');

    if (token) {
      // Set the token in the axios instance headers
      axiosInstance.defaults.headers.common['x-access-token'] = token;

      // Send a GET request to the backend to get engraving inventory levels
      const response = await axiosInstance.get(
        `${BASE_URL}/getEngravingInventoryLevels`
      );

      // Return the response data from the API
      return response.data;
    } else {
      // Throw an error if the token is not available
      throw new Error('Token not available');
    }
  } catch (error) {
    // Handle errors and return them in a structured format
    console.error('Error in getEngravingInventoryLevels:', error);
    return {
      success: false,
      message: error.response ? error.response.data : error.message,
    };
  }
},
outwardFromStorage: async (data) => {
  try {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('x-access-token');

    if (token) {
      // Set the token in the axios instance headers
      axiosInstance.defaults.headers.common['x-access-token'] = token;

      // Send a POST request to the backend to handle outward from storage
      const response = await axiosInstance.post(
        `${BASE_URL}/outwardFromStorage`,
        data
      );

      // Return the response data from the API
      return response.data;
    } else {
      // Throw an error if the token is not available
      throw new Error('Token not available');
    }
  } catch (error) {
    // Handle errors and return them in a structured format
    console.error('Error in outwardFromStorage:', error);
    return {
      success: false,
      message: error.response ? error.response.data : error.message,
    };
  }
},
addQRCodesToInventory: async (orderId, qrCodes) => {
  try {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('x-access-token');

    if (token) {
      // Set the token in the axios instance headers
      axiosInstance.defaults.headers.common['x-access-token'] = token;

      // Send a POST request to the backend to add QR codes to the inventory
      const response = await axiosInstance.post(
        `${BASE_URL}/addQRCodesToInventory`,
        { orderId, qrCodes }
      );

      // Return the response data from the API
      return response.data;
    } else {
      // Throw an error if the token is not available
      throw new Error('Token not available');
    }
  } catch (error) {
    // Handle errors and return them in a structured format
    console.error('Error in addQRCodesToInventory:', error);
    return {
      success: false,
      message: error.response ? error.response.data : error.message,
    };
  }
},

};
