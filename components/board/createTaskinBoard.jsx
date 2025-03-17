import { PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import TaskTypeBadge from "./taskTypeBadge";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import useTaskAction from "@/lib/hook/useTaskAction";

const CreateTaskInBoard = ({ projectId }) => {
  const { projectDetail } = useSelector((state) => state.detailProject);

  const timeoutRef = useRef(null);
  const { allTaskType } = useSelector((state) => state.board);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { createTaskAction } = useTaskAction();
  const [valueCreateTask, setValueCreateTask] = useState({
    listUserAsign: [],
    taskName: "",
    description: "",
    statusId: "1",
    originalEstimate: 0,
    timeTrackingSpent: 0,
    timeTrackingRemaining: 0,
    projectId: String(projectId),
    typeId: 1,
    priorityId: 2,
  });

  const onChangeForm = (name, value) => {
    setValueCreateTask({ ...valueCreateTask, [name]: value });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Ngăn xuống dòng
      // handleSubmit(); // Gửi form
      createTaskAction({ valueCreateTask, projectId: projectDetail.id });
    }
  };

  return (
    <div className="my-2">
      {isOpen ? (
        <div
          className="bg-white rounded focus-within:border-gray-900 focus-within:ring-1"
          onFocus={() => {
            clearTimeout(timeoutRef.current);
            setIsOpen(true);
          }}
          onBlur={() => {
            timeoutRef.current = setTimeout(() => {
              if (!isSelectOpen) {
                setIsOpen(false);
              }
            }, 200);
          }}
          tabIndex={-1} // Để có thể nhận onBlur
        >
          <Textarea
            placeholder="what need to be done?"
            className="resize-none border-none focus-visible:ring-0 focus-visible:outline-none"
            name="taskName"
            autoFocus
            onChange={(e) => onChangeForm(e.target.name, e.target.value)}
            onFocus={() => {
              clearTimeout(timeoutRef.current);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
          />
          <Select
            onOpenChange={setIsSelectOpen}
            value={valueCreateTask.typeId}
            onValueChange={(value) => {
              onChangeForm("typeId", Number(value));
            }}
          >
            <SelectTrigger className="w-full focus:ring-0 focus:outline-none border-none rounded-sm   hover:bg-gray-200">
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
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          className=" w-full flex font-semibold p-2 text-xs rounded hover:bg-gray-300 transition duration-200"
        >
          <PlusIcon size={14} /> Create
        </Button>
      )}
    </div>
  );
};

export default CreateTaskInBoard;
