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
  updateDescription: async (taskId, description) => {
    const response = await interseter.put("/Project/updateDescription", {
      taskId,
      description,
    });

    return response.data;
  },

  updateStatus: async (taskId, statusId) => {
    const response = await interseter.put("/Project/updateStatus", {
      taskId,
      statusId,
    });

    return response.data;
  },
  updatePriority: async (taskId, priorityId) => {
    const response = await interseter.put("/Project/updatePriority", {
      taskId,
      priorityId,
    });

    return response.data;
  },

  updateTask: async (valueUpdateTask) => {
    const response = await interseter.post(
      "/Project/updateTask",
      valueUpdateTask
    );
    return response.data;
  },
  updateEstimate: async (taskId, originalEstimate) => {
    const response = await interseter.put("/Project/updateEstimate", {
      taskId,
      originalEstimate,
    });
    return response.data;
  },
  updateTimeTracking: async (
    taskId,
    timeTrackingSpent,
    timeTrackingRemaining
  ) => {
    const response = await interseter.put("/Project/updateTimeTracking", {
      taskId,
      timeTrackingSpent,
      timeTrackingRemaining,
    });
    return response.data;
  },

  insertComment: async (taskId, contentComment) => {
    const respone = await interseter.post(`/Comment/insertComment`, {
      taskId,
      contentComment,
    });

    return respone.data;
  },
  updateComment: async (idComment, contentComment) => {
    const respone = await interseter.put(
      `/Comment/updateComment?id=${idComment}&contentComment=${contentComment}`
    );

    return respone.data;
  },
  deleteComment: async (idComment) => {
    const respone = await interseter.delete(
      `/Comment/deleteComment?idComment=${idComment}`
    );

    return respone.data;
  },
};
