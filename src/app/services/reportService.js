import { axiosInstance } from '../utils/assets';

import { BASE_URL } from '../utils/assets';

export const reportServices = {
  generateStorageRoomReport: async (data) => {
    console.log('data===', data);
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        console.log('called server===');
        const response = await axiosInstance.post(
          `${BASE_URL}/storage_room_day_starting_count`,
          data
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },

  generateInventoryRoomReport: async (data) => {
    console.log('data===', data);
    try {
      const token = localStorage.getItem('x-access-token');
      if (token) {
        axiosInstance.defaults.headers.common['x-access-token'] = token;
        console.log('called server===');
        const response = await axiosInstance.post(
          `${BASE_URL}/inventory_room_day_starting_count`,
          data
        );
        return response.data;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      throw { message: error.response.data };
    }
  },
};
