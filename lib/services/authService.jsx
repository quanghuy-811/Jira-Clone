import { axiosInstance } from "../axios";
const axiosClient = axiosInstance();
export const authService = {
  register: async (userData) => {
    try {
      const response = await axiosClient.post("/Users/signup", {
        email: userData.email,
        passWord: userData.password,
        name: userData.name,
        phoneNumber: userData.phoneNumber || "",
      });
      return response.data;
    } catch (error) {
      console.error("Register API Error:", error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosClient.post("/Users/signin", {
        email: credentials.email,
        passWord: credentials.password,
      });
      return response.data;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
  },

  getProfile: async () => {
    const response = await axiosClient.get("/Users/getUser");
    console.log("Profile API Response:", response.data);
    return response.data.content; // Adjust based on your API response structure
  },
};
