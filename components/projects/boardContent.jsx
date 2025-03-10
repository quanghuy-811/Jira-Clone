"use client";
import { setBoardData, updateStatus } from "@/store/slices/boardSlice";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailTaskDialog from "../detail-task-dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { AddMemberDialog } from "../add-member-dialog";
import {
  getProjectById,
  updateStatusUI,
} from "@/store/slices/projectDetailSlice";
import { toast } from "sonner";
import TaskTypeBadge from "../board/taskTypeBadge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const BoardContent = memo(({ boardData, projectId }) => {
  const [taskId, setTaskId] = useState("");
  const [isOpen, setIsOpen] = useState(false); // (dialog Detail Task)
  const [isAddMember, setIsAddMember] = useState(false); // (dialog Add member)
  const dispatch = useDispatch();

  const { projectDetail } = useSelector((state) => state.detailProject);

  const onCloseDialog = useCallback(() => setIsAddMember(false), []);

  useEffect(() => {
    if (!projectId) return;
    dispatch(getProjectById({ projectId }));
    if (boardData) {
      dispatch(setBoardData(boardData));
    }
  }, [projectId, dispatch]);

  // Task component (Draggable)
  const Task = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: task.taskId.toString(),
    });
    const maxVisible = 2;

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={() => {
          setTaskId(task.taskId);
          setIsOpen(true);
        }}
        style={{
          transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : "",
        }}
        className="px-2 py-3 my-2 text-sm bg-white rounded shadow hover:shadow-md cursor-grab active:opacity-60"
      >
        {task.alias}
        {task.taskId}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <TaskTypeBadge taskType={task?.taskTypeDetail?.taskType} />
            <p className="px-1 py-0.5 border border-gray-300 text-xs font-semibold rounded-sm">
              {task.priorityTask.priority}
            </p>
          </div>
          <div className="flex items-center -space-x-2">
            {task?.assigness?.slice(0, 2).map((item) => {
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
            {task?.assigness?.length > maxVisible && (
              <Avatar className=" bg-gray-300 w-7 h-7 border-2 border-white">
                <AvatarFallback className="text-gray-500 text-xs">
                  +{task.assigness.length - maxVisible}
                </AvatarFallback>
              </Avatar>
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
        className="w-1/4 p-2  bg-gray-200 rounded shadow min-h-[200px]"
      >
        <Badge> {status.statusName}</Badge>
        {tasks.map((task) => (
          <Task key={task.taskId} task={task} />
        ))}
      </div>
    );
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

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
  // Chỉ kích hoạt kéo khi di chuyển tối thiểu 5px
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3, // Phải di chuyển ít nhất 5px mới bắt đầu kéo
    },
  });

  const sensors = useSensors(pointerSensor);
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-3xl w-3/12 text-black font-medium">Board</h1>
        <div className="flex-1 flex flex-wrap space-x-1 items-center">
          <h2 className="text-sm mr-2 font-semibold">Member</h2>
          {projectDetail?.members?.length > 0
            ? projectDetail.members.map((user, index) => (
                <TooltipProvider key={user.userId} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        className="h-7 w-7 border border-gray-400 rounded-full"
                        src={user.avatar}
                        alt=""
                      />
                    </TooltipTrigger>
                    <TooltipContent>{user.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))
            : ""}
          <Button
            onClick={() => setIsAddMember(true)}
            className="rounded-full h-8 w-8"
            variant="outline"
            size="sm"
          >
            <Plus />
          </Button>
        </div>
      </div>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 ">
          {projectDetail?.lstTask?.length > 0 ? (
            projectDetail.lstTask.map((status) => (
              <Column
                key={status.statusId}
                status={status}
                tasks={status.lstTaskDeTail.filter(
                  (task) => task.statusId === status.statusId
                )}
              />
            ))
          ) : (
            <div className="text-center">Loading ...</div>
          )}
        </div>
      </DndContext>
      {/* Dialog add member */}
      <AddMemberDialog
        project={projectDetail}
        isOpen={isAddMember}
        onClose={onCloseDialog}
      />

      {/* Dialog detail task */}
      <DetailTaskDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        taskId={taskId}
      />
    </div>
  );
});

export default BoardContent;
