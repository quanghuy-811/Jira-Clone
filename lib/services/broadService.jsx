import { axiosInstance } from "../axios";

const interseter = axiosInstance();
export const boardService = {
  getAllStatus: async () => {
    const response = await interseter.get("/Status/getAll");

    return response.data;
  },

  getAllPriority: async () => {
    const response = await interseter.get("/Priority/getAll");
    return response.data;
  },

  getAllTaskType: async () => {
    const response = await interseter.get("/TaskType/getAll");
    return response.data;
  },

  getTaskDetail: async (taskId) => {
    const response = await interseter.get(
      `/Project/getTaskDetail?taskId=${taskId}`
    );
    return response.data;
  },

  updateStatus: async (taskId, statusId) => {
    const response = await interseter.put("/Project/updateStatus", {
      taskId,
      statusId,
    });

    return response.data;
  },
};
