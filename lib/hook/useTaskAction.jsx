import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { boardService } from "../services/broadService";
import {
  getTaskDetail,
  updateDescription,
  updateEstimate,
  updatePriority,
  updateStatus,
  updateTask,
  updateTimeTracking,
} from "@/store/slices/boardSlice";
import { getProjectById } from "@/store/slices/projectDetailSlice";

const useTaskAction = () => {
  const { projectDetail } = useSelector((state) => state.detailProject);
  const dispatch = useDispatch();

  const updateTaskAction = async ({ valueUpdateTask, taskId }) => {
    console.log(taskId);

    try {
      await dispatch(updateTask({ valueUpdateTask })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      if (error.statusCode === 404) {
        toast.warning(error.content);
        return;
      }
      toast.warning("Update Task failed");
    }
  };

  const updateStatusAction = async ({ taskId, newStatusId }) => {
    try {
      await dispatch(updateStatus({ taskId, newStatusId })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      toast.warning("Update Status failed");
    }
  };

  const updatePriorityAction = async ({ taskId, priorityId }) => {
    try {
      await dispatch(updatePriority({ taskId, priorityId })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      if (error.statusCode === 404) {
        toast.warning(error.content);
        return;
      }
      toast.warning("Update Priority failed");
    }
  };

  const updateEstimateAction = async ({ taskId, originalEstimate }) => {
    try {
      await dispatch(updateEstimate({ taskId, originalEstimate })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      if (error.statusCode === 404) {
        toast.warning(error.content);
        return;
      }
      toast.warning("update Estimate faild");
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

  const updateDescriptionAction = async ({ taskId, description }) => {
    try {
      await dispatch(updateDescription({ taskId, description })).unwrap();
      dispatch(getTaskDetail({ taskId }));
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      if (error.statusCode === 404) {
        toast.warning(error.content);
        return;
      }
      toast.warning("Update description failed");
    }
  };

  return {
    updateTaskAction,
    updateStatusAction,
    updatePriorityAction,
    updateTimeTrackingAction,
    updateEstimateAction,
    updateDescriptionAction,
  };
};

export default useTaskAction;
