"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getTaskDetail } from "@/store/slices/boardSlice";
import React, { memo, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { toast } from "sonner";
import { getProjectById } from "@/store/slices/projectDetailSlice";
// import TaskTypeBadge from "./board/taskTypeBadge";
// import TaskComment from "./board/taskComment";
import { ScrollArea } from "../ui/scroll-area";

import useTaskAction from "@/lib/hook/useTaskAction";
import { Trash, X } from "lucide-react";

import TaskAssignees from "./taskAssignees";
import TaskDescription from "./taskDescription";
import TaskComment from "./taskComment";
import TaskEstimate from "./taskEstimate";
import TaskTimeTracking from "./taskTimeTracking";
import TaskTypeBadge from "./taskTypeBadge";
import { Button } from "../ui/button";

const DetailTaskDialog = ({ isOpen, onClose, taskId }) => {
  const {
    updateTaskAction,
    updateStatusAction,
    updatePriorityAction,
    removeTaskAction,
  } = useTaskAction();
  const { allStatus, allPriority, allTaskType, taskDetail } = useSelector(
    (state) => state.board,
    shallowEqual
  );
  const dispatch = useDispatch();

  //
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

  // Remove Task
  const handleRemoveTask = (taskId) => {
    removeTaskAction({ taskId, callback: () => onClose() });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={null}
        className="h-[650px] lg:h-auto overflow-y-auto sm:overflow-auto"
      >
        <DialogTitle className="sr-only">Task Details</DialogTitle>
        {!taskDetail ? (
          <div>Loading...</div>
        ) : (
          <div>
            {/* Tasktype */}
            <div className="flex items-end justify-between">
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

              <div className="h-full flex items-center space-x-4">
                <Button
                  onClick={() => handleRemoveTask(taskDetail.taskId)}
                  variant="ghost"
                  size="icon"
                >
                  <Trash />
                </Button>

                <Button onClick={onClose} variant="ghost" size="icon">
                  <X />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-3">
              <div className="">
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
              <div className="space-y-6">
                {/* Status */}
                <Select
                  value={taskDetail?.statusId}
                  onValueChange={(value) => {
                    onChangeSelectStatus(value);
                  }}
                >
                  <SelectTrigger className="w-2/3 rounded-sm text-xs font-semibold border-gray-300 bg-blue-100 hover:bg-blue-200">
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
                <TaskAssignees taskId={taskId} />

                {/* Priority*/}
                <div className="grid grid-cols-1 md:grid-cols-4 items-center">
                  <div className=" text-sm font-semibold ">Priority</div>
                  <div className="md:col-span-3 mt-3 md:mt-0">
                    <Select
                      value={taskDetail?.priorityTask?.priorityId}
                      onValueChange={(value) => {
                        onChangeSelectPriority(value);
                      }}
                    >
                      <SelectTrigger className="w-full [&>svg]:hidden focus:ring-0 focus:outline-none rounded-sm border-none bg-gray-100 md:bg-transparent  hover:bg-gray-200">
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
