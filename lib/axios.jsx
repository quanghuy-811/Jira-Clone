import axios from "axios";
import { getClientAuthToken, getServerAuthToken } from "./utils";

export const axiosInstance = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      TokenCybersoft: process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN,
    },
  });

  instance.interceptors.request.use(
    async (config) => {
      // Lấy token phù hợp với môi trường
      const token =
        typeof window !== "undefined"
          ? getClientAuthToken("accessToken") // Client
          : await getServerAuthToken("accessToken"); // Server

      if (token) {
        config.headers.Authorization = `Bearer ${token.replace(
          /^"(.*)"$/,
          "$1"
        )}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(error);

      return Promise.reject(error);
    }
  );
  return instance;
};
