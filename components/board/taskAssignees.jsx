import { Check, Inbox, X } from "lucide-react";
import { useState, memo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import useTaskAction from "@/lib/hook/useTaskAction";

const TaskAssignees = ({ taskId }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { projectDetail } = useSelector((state) => state.projects);
  const { taskDetail } = useSelector((state) => state.board, shallowEqual);

  const { updateTaskAction } = useTaskAction();

  const filter = projectDetail.members?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
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
    <div className="grid grid-cols-1 md:grid-cols-4 items-center border-b-2">
      <div className=" text-sm font-semibold ">Assignees</div>
      <div className="col-span-3 mt-3 md:mt-0">
        <div className="flex items-center flex-wrap mb-2 gap-1 p-0.5 rounded transition duration-300 hover:bg-gray-200">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor className="w-full">
              <PopoverTrigger className="w-full">
                <div className="flex space-x-1 p-1 flex-wrap items-center">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                      setOpen(true); // Luôn mở popover
                    }}
                    className="btn"
                    color="amber"
                  >
                    Add
                  </Button>
                  {taskDetail?.assigness?.length > 0
                    ? taskDetail.assigness.map((user) => {
                        return (
                          <div
                            key={user.userId}
                            className="flex items-center space-x-1 bg-gray-50 border border-gray-200 text-sm m-0.5 p-1 rounded"
                          >
                            <img
                              className="h-6 w-6 border border-gray-400 rounded-full"
                              src={user.avatar}
                              alt=""
                            />
                            <span className="text-xs">{user.name}</span>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={(e) => {
                                toggleUser(user);
                                e.stopPropagation();
                              }}
                            >
                              <X className="h-4 w-4 hover:text-red-500" />
                            </button>
                          </div>
                        );
                      })
                    : ""}
                </div>
              </PopoverTrigger>
            </PopoverAnchor>
            <PopoverContent
              forceMount
              className="p-0 pointer-events-auto w-[var(--radix-popover-trigger-width)]"
            >
              <div>
                {projectDetail?.members?.length > 0 ? (
                  <ScrollArea className="h-44">
                    <div className="p-1 pr-3">
                      {filter.map((user) => {
                        const isSelected = taskDetail?.assigness?.some(
                          (assignee) => assignee.id === user.userId
                        );
                        return (
                          <div
                            key={user.userId}
                            className={`flex items-center justify-between rounded border-gray-30000 px-2 py-1 hover:bg-gray-100 cursor-pointer`}
                            onClick={(e) => {
                              toggleUser(user);
                              e.stopPropagation();
                            }}
                          >
                            <div className="flex items-center">
                              <img
                                className="h-7 w-7 mr-2 border border-gray-400 rounded-full"
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
                ) : (
                  <p className="text-gray-400 text-center text-sm">
                    <Inbox
                      className="mx-auto"
                      color="#878787"
                      strokeWidth={0.75}
                      size={36}
                    />
                    No data
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskAssignees);
