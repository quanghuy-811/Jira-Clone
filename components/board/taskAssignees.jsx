import { getTaskDetail, updateTask } from "@/store/slices/boardSlice";
import { Check, Plus, X } from "lucide-react";

import { useState, memo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { getProjectById } from "@/store/slices/projectDetailSlice";
import useTaskAction from "@/lib/hook/useTaskAction";

const Assignees = ({ taskId }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { projectDetail } = useSelector((state) => state.detailProject);
  const { taskDetail } = useSelector((state) => state.board, shallowEqual);
  const { updateTaskAction } = useTaskAction();

  const toggleUser = (user) => {
    const userId = user.userId ?? user.id;
    const currentUserIds = taskDetail?.assigness?.map((u) => u.id) || []; // lấy danh sách các userId
    const updatedUserIds = currentUserIds.includes(userId)
      ? currentUserIds.filter((id) => id !== userId) // Nếu có thì xóa
      : [...currentUserIds, user.userId]; // Nếu chưa có thì thêm

    updateTaskAction({
      valueUpdateTask: {
        ...taskDetail,
        listUserAsign: updatedUserIds,
      },
      taskId,
    });
  };
  return (
    <div className="flex items-center justify-between border-b-2">
      <div className="w-2/12 text-sm font-semibold ">Assignees</div>
      <div className="w-9/12 ">
        <div className="flex items-center flex-wrap mb-2 gap-1 px-1 py-2 rounded transition duration-300 hover:bg-gray-200">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button size="sm" className=" justify-between h-9 px-3">
                <span className="flex items-center ">
                  <Plus className="mr-1" /> Add
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 z-[999] pointer-events-auto overflow-hidden"
              align="start"
            >
              <ScrollArea className="h-52">
                <div className="p-1 pr-3">
                  {projectDetail?.members?.map((user) => {
                    const isSelected = taskDetail?.assigness?.some(
                      (assignee) => assignee.id === user.userId
                    );
                    return (
                      <div
                        key={user.userId}
                        className={`flex items-center justify-between rounded border-gray-30000 px-2 py-1 hover:bg-gray-300 cursor-pointer`}
                        onClick={(e) => {
                          toggleUser(user);
                          e.stopPropagation();
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 mr-2 border border-gray-400 rounded-full"
                            src={user.avatar}
                            alt=""
                          />

                          <span className="text-sm text-gray-800">
                            {user.name}
                          </span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 ml-2 " />}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          {taskDetail?.assigness?.map((user) => {
            return (
              <div
                key={user.id}
                className="flex items-center bg-white rounded border border-gray-300 pl-1 pr-2 py-1"
              >
                <img
                  className="h-6 w-6 mr-2 border border-gray-400 rounded-full"
                  src={user.avatar}
                  alt=""
                />
                <span className="text-xs truncate max-w-sm">{user.name}</span>
                <button
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => toggleUser(user)}
                >
                  <X className="h-4 w-4 hover:text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Assignees);
