import { axiosInstance } from '../utils/assets';

import { BASE_URL } from '../utils/assets';

export const recordServices = {
  getQrCodesBySkuCode: async (data) => {
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
      
        const response = await axiosInstance.post(
          `${BASE_URL}/getQrCodeBySkuCode`,
          data
        );
        console.log('response==', response);

        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },
};
