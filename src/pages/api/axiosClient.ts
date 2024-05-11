import axios from "axios";
import { apiURL } from "./api";

const getToken = (): string | null => {

  if(typeof window !== "undefined") {

    const token = localStorage.getItem("token");
    return token;
  }

  return null;
};

export const axiosClient = axios.create({
  baseURL: apiURL,
  headers: {
    Authorization: "Bearer" + getToken(),
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
