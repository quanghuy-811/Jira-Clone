import { memo, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject } from "@/store/slices/projectSlice";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Check, Inbox, X } from "lucide-react";

import { getUserByProjectId } from "@/store/slices/userSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Slider } from "../ui/slider";
import useTaskAction from "@/lib/hook/useTaskAction";

const FormCreateTask = ({ isOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { createTaskAction } = useTaskAction();
  const { allStatus, allPriority, allTaskType } = useSelector(
    (state) => state.board
  );
  const { projectList, projectUser } = useSelector((state) => state.projects);
  const { membersInProject } = useSelector((state) => state.user);

  const filter = membersInProject.listMember?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const formik = useFormik({
    initialValues: {
      listUserAsign: [],
      assigness: [],
      taskName: "",
      description: "",
      statusId: "1",
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: "",
      typeId: 1,
      priorityId: 2,
    },
    validationSchema: Yup.object().shape({
      projectId: Yup.string().required("Please select the project"),
      taskName: Yup.string().required("Task Name is required"),
      description: Yup.string().required("Description is required"),
    }),
    validateOnBlur: false,
    onSubmit: async (values) => {
      createTaskAction({
        valueCreateTask: values,
        projectId: values.projectId,
        callBack: onClose,
      });
    },
  });

  // add and remove user feild
  const toggleUser = (user) => {
    const updatedUserIds = formik.values.listUserAsign.includes(user.userId)
      ? formik.values.listUserAsign.filter((id) => id !== user.userId) // Nếu có thì xóa
      : [...formik.values.listUserAsign, user.userId]; // Nếu chưa có thì thêm
    formik.setFieldValue("listUserAsign", updatedUserIds);

    const isUserExist = formik.values.assigness.some(
      (u) => u.userId === user.userId
    );
    const updatedAssigness = isUserExist
      ? formik.values.assigness.filter((u) => u.userId !== user.userId) // Nếu có thì xóa
      : [...formik.values.assigness, user]; // Nếu chưa có thì thêm
    formik.setFieldValue("assigness", updatedAssigness);
  };

  // change select Project
  const onChangeSelectProject = (value) => {
    // dispatch(getProjectById({ projectId: value }));
    dispatch(getUserByProjectId({ projectId: value }));
    formik.setFieldValue("projectId", value);
  };
  useEffect(() => {
    if (isOpen && projectList.length === 0) {
      dispatch(fetchProject());
    }
  }, [isOpen]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent aria-describedby={null} className="max-w-6xl">
          <div className="flex justify-between items-center">
            <DialogTitle>Create Task</DialogTitle>

            <Button
              className="btn"
              onClick={onClose}
              variant="ghost"
              size="icon"
            >
              <X />
            </Button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <ScrollArea className="h-96 pr-5">
              <div className="space-y-4">
                {/* Project */}
                <div>
                  <Label>Project</Label>
                  <Select
                    value={formik.values.projectId.toString()}
                    onValueChange={(value) => {
                      onChangeSelectProject(value);
                    }}
                    onBlur={formik.handleBlur}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="select project">
                        {formik.values.projectId
                          ? projectUser?.find(
                              (p) => p.id === formik.values.projectId
                            )?.projectName
                          : "Select project"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {projectUser?.length ? (
                        <>
                          {projectUser?.map((item) => {
                            return (
                              <SelectItem
                                className="text-sm bg-gray-100 my-1 hover:bg-gray-200"
                                key={item.id}
                                value={String(item.id)}
                              >
                                {item.projectName}
                              </SelectItem>
                            );
                          })}
                        </>
                      ) : (
                        <div className="text-gray-500 my-3 text-xs text-center">
                          Loading...
                        </div>
                      )}
                    </SelectContent>
                  </Select>

                  {formik.touched.projectId && formik.errors.projectId && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.projectId}
                    </p>
                  )}
                </div>
                {/* Task Name */}
                <div>
                  <Label>Task name</Label>
                  <Input
                    name="taskName"
                    placeholder="Enter task name"
                    value={formik.values.taskName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.taskName && formik.errors.taskName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.taskName}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formik.values.statusId.toString()}
                    onValueChange={(value) => {
                      formik.setFieldValue("statusId", value);
                    }}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStatus?.map((item) => {
                        return (
                          <SelectItem
                            className="text-xs hover:bg-gray-100"
                            key={item.statusId}
                            value={item.statusId}
                          >
                            {item.statusName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority & Task Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={formik.values.priorityId}
                      onValueChange={(value) => {
                        formik.setFieldValue("priorityId", Number(value));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {allPriority?.map((item) => (
                          <SelectItem
                            className="hover:bg-gray-100"
                            key={item.priorityId}
                            value={item.priorityId}
                          >
                            {item.priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Task Type</Label>
                    <Select
                      value={formik.values.typeId}
                      onValueChange={(value) => {
                        formik.setFieldValue("typeId", Number(value));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allTaskType?.map((item) => (
                          <SelectItem
                            className="hover:bg-gray-100"
                            key={item.id}
                            value={item.id}
                          >
                            {item.taskType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Assigners */}
                <div>
                  <Label>Assigners</Label>
                  <div
                    className={` border rounded-sm border-gray-300  ${
                      open ? "border-gray-600" : "border-gray-300"
                    }`}
                  >
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverAnchor className="w-full">
                        <PopoverTrigger
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                            setOpen(true); // Luôn mở popover
                          }}
                          className="w-full"
                        >
                          <div className="flex p-0">
                            {formik.values.assigness.length > 0 ? (
                              <div className="flex space-x-1 p-1">
                                {formik.values.assigness.map((user) => {
                                  return (
                                    <div
                                      key={user.id}
                                      className="flex items-center  bg-gray-200 rounded border border-gray-300 pl-1 pr-2 "
                                    >
                                      <span className="text-xs truncate max-w-md">
                                        {user.name}
                                      </span>
                                      <button
                                        className="ml-1 text-gray-500 hover:text-gray-700"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleUser(user);
                                          setTimeout(() => setOpen(true), 0);
                                        }}
                                      >
                                        <X className="h-3 w-3 hover:text-red-500" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              ""
                            )}

                            <Input
                              className=" border-0 p-0 pl-1 shadow-none text-xs focus:border-none"
                              // value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              onFocus={(e) => {
                                // Ngăn chặn focus bubble lên div cha
                                setOpen(true);
                              }}
                            />
                          </div>
                        </PopoverTrigger>
                      </PopoverAnchor>
                      <PopoverContent
                        forceMount
                        className="p-0 pointer-events-auto w-[var(--radix-popover-trigger-width)]"
                      >
                        {membersInProject.listMember.length > 0 ? (
                          <ScrollArea className="h-44">
                            <div className="p-1 pr-3">
                              {filter.map((user) => {
                                const isSelected =
                                  formik.values.listUserAsign?.includes(
                                    user.userId
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
                                        className="h-8 w-8 mr-2 border border-gray-400 rounded-full"
                                        src={user.avatar}
                                        alt=""
                                      />

                                      <span className="text-sm text-gray-800">
                                        {user.name}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <Check className="h-4 w-4 ml-2 " />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        ) : (
                          <p className="text-gray-400 text-center text-sm">
                            <Inbox
                              className="mx-auto "
                              color="#878787"
                              strokeWidth={0.75}
                              size={36}
                            />
                            No data
                          </p>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Time Tracking */}
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Total Estimated Hours</Label>

                      <Input
                        name="originalEstimate"
                        placeholder="Total Estimated Hours"
                        value={formik.values.originalEstimate}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "originalEstimate",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Hours spent</Label>
                      <Input
                        type="timeTrackingSpent"
                        placeholder="Hours spent"
                        value={formik.values.timeTrackingSpent}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "timeTrackingSpent",
                            Number(e.target.value)
                          );

                          formik.setFieldValue(
                            "timeTrackingRemaining",
                            formik.values.originalEstimate -
                              Number(e.target.value)
                          );
                        }}
                      />
                    </div>
                  </div>
                  <Slider
                    min={0}
                    max={formik.values.originalEstimate} // Giới hạn max theo estimatedHours
                    value={[formik.values.timeTrackingSpent]}
                    className="mt-4"
                  />
                  <p className="text-xs sm:text-sm mt-2 flex justify-between">
                    <b>{formik.values.timeTrackingSpent} hour(s) spent</b>
                    <b>
                      {formik.values.timeTrackingRemaining}
                      hour(s) remaining
                    </b>
                  </p>
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Description..."
                    value={formik.values.description}
                    onChange={(e) =>
                      formik.setFieldValue("description", e.target.value)
                    }
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.description}
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Buttons */}
            <DialogFooter className={"pt-2"}>
              <Button
                className="btn hover:text-red-600"
                onClick={onClose}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="btn" color="primary" type="submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(FormCreateTask);
