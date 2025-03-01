import { axiosInstance } from "../axios";
const interseter = axiosInstance();
export const projectService = {
  getAllProjects: async () => {
    const response = await interseter.get("/Project/getAllProject");
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await interseter.post("/Project/createProjectAuthorize", {
      projectName: projectData.projectName,
      description: projectData.description,
      categoryId: projectData.categoryId,
      alias: projectData.projectName.toLowerCase().replace(/ /g, "-"),
    });
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await interseter.get(`/Project/getProjectDetail?id=${id}`);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await interseter.put(
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
    const response = await interseter.delete(
      `/Project/deleteProject?projectId=${projectId}`
    );
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await interseter.get("/ProjectCategory");
    return response.data.content;
  },
};
