import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
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
      // console.log(error);

      if (error.response?.status === 401) {
        // localStorage.removeItem("accessToken");
        // window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
