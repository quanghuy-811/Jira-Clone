"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getTaskDetail,
  updatePriority,
  updateStatus,
  updateTask,
} from "@/store/slices/boardSlice";
import React, { memo, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import Assignees from "./board/taskAssignees";
import { toast } from "sonner";
import { getProjectById } from "@/store/slices/projectDetailSlice";
import TaskTypeBadge from "./board/taskTypeBadge";
import TaskComment from "./board/taskComment";
import { ScrollArea } from "./ui/scroll-area";
import TaskDescription from "./board/taskDescription";
import TaskEstimate from "./board/taskEstimate";
import TaskTimeTracking from "./board/taskTimeTracking";
import useTaskAction from "@/lib/hook/useTaskAction";

const DetailTaskDialog = ({ isOpen, onClose, taskId }) => {
  const { updateTaskAction, updateStatusAction, updatePriorityAction } =
    useTaskAction();
  const { allStatus, allPriority, allTaskType, taskDetail } = useSelector(
    (state) => state.board,
    shallowEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!taskId || !isOpen) return;

    dispatch(getTaskDetail({ taskId }));
  }, [taskId, isOpen]);

  // Tasktype
  const onChangeSelectTaskType = (value) => {
    const currentUserIds = taskDetail?.assigness?.map((u) => u.id) || [];
    updateTaskAction({
      valueUpdateTask: {
        ...taskDetail,
        typeId: value,
        listUserAsign: currentUserIds,
      },
      taskId,
    });
  };

  //Status
  const onChangeSelectStatus = (value) => {
    updateStatusAction({ taskId, newStatusId: value });
  };
  //Priority
  const onChangeSelectPriority = (value) => {
    updatePriorityAction({ taskId, priorityId: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={null} className="max-w-6xl">
        <DialogTitle className="sr-only">Task Details</DialogTitle>
        {!taskDetail ? (
          <div>Loading...</div>
        ) : (
          <div>
            {/* Tasktype */}
            <div>
              <Select
                value={taskDetail?.taskTypeDetail?.id}
                onValueChange={(value) => {
                  onChangeSelectTaskType(value);
                }}
              >
                <SelectTrigger className="w-auto [&>svg]:hidden focus:ring-0 focus:outline-none border-none rounded-sm  border-gray-300 bg-gray-100 hover:bg-gray-200">
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allTaskType?.map((item) => {
                      return (
                        <SelectItem
                          className="hover:bg-gray-200 text-sm"
                          key={item.id}
                          value={item.id}
                        >
                          <div className="flex items-center space-x-3">
                            <TaskTypeBadge taskType={item.taskType} />
                            <p className="capitalize">{item.taskType}</p>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-7 mt-3">
              <div className="w-6/12 ">
                <ScrollArea className="h-96 pr-7">
                  <div className="space-y-6">
                    <h2 className="text-xl mb-4 font-semibold">
                      {taskDetail?.taskName}
                    </h2>
                    {/* description */}
                    <TaskDescription taskId={taskId} />

                    {/* Comment */}

                    <TaskComment taskId={taskId} />
                  </div>
                </ScrollArea>
              </div>
              <div className="w-6/12 space-y-6">
                {/* Status */}
                <Select
                  value={taskDetail?.statusId}
                  onValueChange={(value) => {
                    onChangeSelectStatus(value);
                  }}
                >
                  <SelectTrigger className="w-1/2 rounded-sm text-xs font-semibold border-gray-300 bg-blue-100 hover:bg-blue-200">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {allStatus?.map((item) => {
                        return (
                          <SelectItem
                            className="hover:bg-gray-200 text-xs"
                            key={item.statusId}
                            value={item.statusId}
                          >
                            {item.statusName}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/*Assignee  */}
                <Assignees taskId={taskId} />

                {/* Priority*/}
                <div className="flex items-center justify-between">
                  <div className="w-2/12 text-sm font-semibold ">Priority</div>
                  <div className="w-9/12 ">
                    <Select
                      value={taskDetail?.priorityTask?.priorityId}
                      onValueChange={(value) => {
                        onChangeSelectPriority(value);
                      }}
                    >
                      <SelectTrigger className="w-full [&>svg]:hidden focus:ring-0 focus:outline-none rounded-sm border-none  hover:bg-gray-200">
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {allPriority?.map((item) => {
                            return (
                              <SelectItem
                                className="hover:bg-gray-200"
                                key={item.priorityId}
                                value={item.priorityId}
                              >
                                {item.priority}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Estimate */}
                <TaskEstimate />
                {/* Time tracking */}
                <TaskTimeTracking />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default memo(DetailTaskDialog);
