"use client";
import { boardService } from "@/lib/services/broadService";
import {
  setBoardData,
  updateStatus,
  updateStatusUI,
} from "@/store/slices/boardSlice";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DetailTaskDialog from "../detail-task-dialog";

const BoardContent = ({ boarData }) => {
  const dispatch = useDispatch();
  const { resProjectById } = boarData;
  const { tasks } = useSelector((state) => state.board);

  const [isOpen, setIsOpen] = useState(false); // (dialog)
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    dispatch(setBoardData(boarData));
  }, [boarData]);
  // Task component (Draggable)
  const Task = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: task.taskId.toString(),
    });

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
        <h2
          className={`px-1 mb-2 text-xs font-semibold rounded inline-block ${
            status.statusId === "4"
              ? "bg-green-300 text-gray-700"
              : "text-gray-300 bg-black"
          }`}
        >
          {status.statusName}
        </h2>
        {tasks.map((task) => (
          <Task key={task.taskId} task={task} />
        ))}
      </div>
    );
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    dispatch(updateStatus({ taskId: active.id, newStatusId: over.id }));
    dispatch(updateStatusUI({ taskId: active.id, newStatusId: over.id }));
  };
  // Chỉ kích hoạt kéo khi di chuyển tối thiểu 5px
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3, // Phải di chuyển ít nhất 5px mới bắt đầu kéo
    },
  });

  const sensors = useSensors(pointerSensor);

  return (
    <div>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 ">
          {tasks.length > 0
            ? tasks?.map((status) => (
                <Column
                  key={status.statusId}
                  status={status}
                  tasks={status.lstTaskDeTail.filter(
                    (task) => task.statusId === status.statusId
                  )}
                />
              ))
            : ""}
        </div>
      </DndContext>
      <DetailTaskDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        taskId={taskId}
        onPointerDown={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default BoardContent;
