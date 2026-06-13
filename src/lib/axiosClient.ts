import axios from "axios";
import { getStoredToken } from "./auth/getStoredToken";

const apiURL = process.env.API_URL;

export const axiosClient = axios.create({
  baseURL: apiURL,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Always read the latest token from storage to ensure requests
    // use the most current token (handles storage updates after login)
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
