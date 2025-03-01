import { axiosInstance } from "../axios";
const interseter = axiosInstance();
export const userService = {
  getUser: async () => {
    const response = await interseter.get("/Users/getUser");
    return response.data;
  },

  getUserByProjectId: async (projectId) => {
    const response = await interseter.get(
      `/Users/getUserByProjectId?idProject=${projectId}`
    );
    return response.data;
  },

  removeUserFromProject: async (projectId, userId) => {
    const response = await interseter.post(`/Project/removeUserFromProject`, {
      projectId,
      userId,
    });
    return response.data;
  },

  // User Management
  assignUserToProject: async (projectId, userId) => {
    const response = await interseter.post("/Project/assignUserProject", {
      projectId,
      userId,
    });
    return response.data;
  },
};
