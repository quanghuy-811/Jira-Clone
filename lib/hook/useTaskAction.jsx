import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { boardService } from "../services/broadService";
import {
  createTask,
  getTaskDetail,
  removeTask,
  updateDescription,
  updateEstimate,
  updatePriority,
  updateStatus,
  updateTask,
  updateTimeTracking,
} from "@/store/slices/boardSlice";
import { getProjectById } from "@/store/slices/projectDetailSlice";
import { useRouter } from "next/navigation";

const useTaskAction = () => {
  const router = useRouter();
  const { projectDetail } = useSelector((state) => state.detailProject);
  const dispatch = useDispatch();

  const createTaskAction = async ({ valueCreateTask, projectId, callBack }) => {
    try {
      await dispatch(createTask({ valueCreateTask })).unwrap();
      dispatch(getProjectById({ projectId }));
      if (callBack) {
        callBack();
      }
    } catch (error) {
      console.log(error);

      dispatch(getProjectById({ projectId }));
      toast.warning(error.content);
    }
  };

  const updateTaskAction = async ({ valueUpdateTask, taskId }) => {
    try {
      await dispatch(updateTask({ valueUpdateTask })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      router.refresh();
    } catch (error) {
      toast.warning(error.content);
    }
  };

  const removeTaskAction = async ({ taskId, callback }) => {
    try {
      await dispatch(removeTask({ taskId })).unwrap();
      if (callback) callback();
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      dispatch(getProjectById({ projectId: projectDetail.id }));
      toast.warning(error.content);
    }
  };

  const updateStatusAction = async ({ taskId, newStatusId }) => {
    try {
      await dispatch(updateStatus({ taskId, newStatusId })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      router.refresh();
    } catch (error) {
      toast.warning("Update Status failed");
    }
  };

  const updatePriorityAction = async ({ taskId, priorityId }) => {
    try {
      await dispatch(updatePriority({ taskId, priorityId })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      router.refresh();
    } catch (error) {
      toast.warning(error.content);
    }
  };

  const updateEstimateAction = async ({
    taskId,
    originalEstimate,
    callBack,
  }) => {
    try {
      await dispatch(updateEstimate({ taskId, originalEstimate })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      router.refresh();

      if (callBack) {
        callBack();
      }
    } catch (error) {
      console.log(error);
      toast.warning(error.content);
    }
  };
  const updateTimeTrackingAction = async ({
    taskId,
    timeTrackingSpent,
    timeTrackingRemaining,
    callback,
  }) => {
    try {
      await dispatch(
        updateTimeTracking({
          taskId,
          timeTrackingSpent,
          timeTrackingRemaining,
        })
      ).unwrap();
      dispatch(getTaskDetail({ taskId }));

      if (callback) callback();
    } catch (error) {
      if (error.statusCode === 404) {
        toast.warning(error.content);
        return;
      }
      toast.warning("Update TimeTracking failed");
    }
  };

  const updateDescriptionAction = async ({ taskId, description, callBack }) => {
    try {
      await dispatch(updateDescription({ taskId, description })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      router.refresh();
      if (callBack) {
        callBack();
      }
    } catch (error) {
      console.log("error: ", error);
      toast.warning(error.content);
    }
  };

  return {
    updateTaskAction,
    updateStatusAction,
    updatePriorityAction,
    updateTimeTrackingAction,
    updateEstimateAction,
    updateDescriptionAction,
    createTaskAction,
    removeTaskAction,
  };
};

export default useTaskAction;
