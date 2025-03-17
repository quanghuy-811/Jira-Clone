"use client";
import { getTaskInfo, updateStatus } from "@/store/slices/boardSlice";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Plus, PlusIcon, User } from "lucide-react";
import { AddMemberDialog } from "../add-member-dialog";
import {
  getProjectById,
  setProjectDetail,
  updateStatusUI,
} from "@/store/slices/projectDetailSlice";
import { toast } from "sonner";
import TaskTypeBadge from "./taskTypeBadge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CreateTaskInBoard from "./createTaskinBoard";
import DetailTaskDialog from "./detail-task-dialog";

const BoardContent = ({ project, users }) => {
  const dispatch = useDispatch();
  const [taskId, setTaskId] = useState("");
  const [isOpenTask, setIsOpenTask] = useState(false); // (dialog Detail Task)
  const { projectDetail } = useSelector((state) => state.detailProject);

  useEffect(() => {
    dispatch(setProjectDetail(project));
  }, [project]);

  // Task component (Draggable)
  const Task = ({ task }) => {
    const maxVisible = 2;
    const clickTimer = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: task.taskId.toString(),
    });

    const handlePointerDown = () => {
      setIsDragging(false);
      clickTimer.current = setTimeout(() => {
        setIsDragging(true); // Nếu giữ lâu thì đánh dấu là đang kéo
      }, 150);
    };

    const handlePointerUp = () => {
      if (!isDragging) {
        setTaskId(task.taskId);
        setIsOpenTask(true);
      }
      clearTimeout(clickTimer.current);
    };

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={{
          transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : "",
        }}
        className="px-2 py-3 my-2 text-sm bg-white rounded shadow hover:shadow-md cursor-grab active:opacity-60"
      >
        {task.taskName}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <TaskTypeBadge taskType={task?.taskTypeDetail?.taskType} />
            <p className="px-1 py-0.5 border border-gray-300 text-xs font-semibold rounded-sm">
              {task.priorityTask.priority}
            </p>
          </div>
          <div className="flex items-center -space-x-2">
            {task?.assigness?.length > 0 ? (
              <>
                {task.assigness.slice(0, 2).map((item) => {
                  return (
                    <TooltipProvider key={item.id} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <img
                            className="h-7 border-2 border-white rounded-full"
                            src={item.avatar}
                            alt="1"
                          />
                        </TooltipTrigger>
                        <TooltipContent>{item.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
                {task.assigness.length > maxVisible && (
                  <Avatar className=" bg-gray-300 w-7 h-7 border-2 border-white">
                    <AvatarFallback className="text-gray-500 text-xs">
                      +{task.assigness.length - maxVisible}
                    </AvatarFallback>
                  </Avatar>
                )}
              </>
            ) : (
              <TooltipProvider delayDuration={1}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className=" bg-gray-400 w-7 h-7 border-2 border-gray-300">
                      <AvatarFallback>
                        <User size={12} />
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>Unassigned</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Column component (Droppable)
  const Column = ({ status, tasks, onDrop }) => {
    const { setNodeRef } = useDroppable({ id: status.statusId.toString() });
    return (
      <div
        ref={setNodeRef}
        className="w-full p-2  bg-gray-200 rounded shadow min-h-[200px]"
      >
        <Badge
          className={`${status.statusName === "DONE" ? "bg-green-700" : ""}`}
        >
          {" "}
          {status.statusName}
        </Badge>
        {tasks.map((task) => (
          <Task key={task.taskId} task={task} />
        ))}

        {/* {} */}
        {status.statusId === "1" ? (
          <CreateTaskInBoard projectId={project.id} />
        ) : (
          ""
        )}
      </div>
    );
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    console.log("over: ", over);
    console.log("active: ", active);

    if (!over) return;

    dispatch(updateStatusUI({ taskId: active.id, newStatusId: over.id }));
    dispatch(updateStatus({ taskId: active.id, newStatusId: over.id }))
      .unwrap()

      .then(() => {})
      .catch((error) => {
        dispatch(getProjectById({ projectId: projectDetail.id }));
        toast.warning("Change Task Error");
      });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );
  return (
    <div>
      {/* {projectDetail?.lstTask?.length > 0 ? ( */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between">
          <h1 className=" text-2xl lg:text-2xl xl:text-3xl xl:w-3/12 text-black font-medium">
            Board
          </h1>
          <div className="xl:flex-1 flex flex-wrap space-x-1 items-center">
            <h2 className="text-xs lg:text-sm mr-2 font-semibold">Member</h2>
            {project.members.length > 0
              ? project.members.map((user, index) => (
                  <TooltipProvider key={user.userId} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <img
                          className="icon__board border border-gray-400 "
                          src={user.avatar}
                          alt=""
                        />
                      </TooltipTrigger>
                      <TooltipContent>{user.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              : ""}
            {/* Add member */}
            <AddMemberDialog projectDetail={project} users={users}>
              {(openDialog) => (
                <Button
                  onClick={openDialog}
                  className="rounded-full h-7 w-7 lg:w-8 lg:h-8"
                  variant="outline"
                  size="sm"
                >
                  <Plus />
                </Button>
              )}
            </AddMemberDialog>
          </div>
        </div>

        {/*  drag-and-drop */}
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
            {projectDetail?.lstTask?.map((status) => (
              <Column
                key={status.statusId}
                status={status}
                tasks={status.lstTaskDeTail.filter(
                  (task) => task.statusId === status.statusId
                )}
              />
            ))}
          </div>
        </DndContext>
      </div>
      {/* // ) : ( // <div className=" text-gray-500 text-center">Loading...</div>
      // )} */}
      {/* Dialog detail task */}
      {isOpenTask && (
        <DetailTaskDialog
          isOpen={isOpenTask}
          onClose={() => {
            setIsOpenTask(false);
          }}
          taskId={taskId}
        />
      )}
    </div>
  );
};

export default BoardContent;
