import { axiosInstance } from "../axios";

export const projectService = {
  getAllProjects: async () => {
    const response = await axiosInstance.get("/Project/getAllProject");
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await axiosInstance.post(
      "/Project/createProjectAuthorize",
      {
        projectName: projectData.projectName,
        description: projectData.description,
        categoryId: projectData.categoryId,
        alias: projectData.projectName.toLowerCase().replace(/ /g, "-"),
      }
    );
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await axiosInstance.get(
      `/Project/getProjectDetail?id=${id}`
    );
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await axiosInstance.put(
      `/Project/updateProject?projectId=${id}`,
      {
        id,
        projectName: projectData.projectName,
        description: projectData.description,
        categoryId: projectData.categoryId,
      }
    );
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await axiosInstance.delete(
      `/Project/deleteProject?projectId=${projectId}`
    );
    return response.data;
  },

  // User Management
  assignUserToProject: async (projectId, userId) => {
    const response = await axiosInstance.post("/Project/assignUserProject", {
      projectId,
      userId,
    });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await axiosInstance.get("/ProjectCategory");
    return response.data.content;
  },
};
