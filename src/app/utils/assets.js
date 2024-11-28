// Local Database - 
export const BASE_URL = 'http://localhost:5000/api/v1';
// Staging Database - 
//export const BASE_URL ='https://staging-backend.ptal.filflo.in/api/v1';
// Prod Database -
// export const BASE_URL = "https://urchin-app-44s76.ondigitalocean.app/api/v1";


import axios from 'axios';
import jwt from 'jsonwebtoken';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const qrAxiosInstance = axios.create({
  baseURL: BASE_URL,
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token:', decoded);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
};
