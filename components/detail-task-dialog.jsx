"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getTaskDetail,
  updateStatus,
  updateStatusUI,
} from "@/store/slices/boardSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Badge } from "./ui/badge";
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];
const DetailTaskDialog = ({ isOpen, onClose, taskId }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const { allStatus, allPriority, allTaskType, taskDetail, loading, error } =
    useSelector((state) => state.board);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // console.log(open);
  useEffect(() => {
    if (!taskId) return;
    setIsEditing(false);
    dispatch(getTaskDetail(taskId));
  }, [taskId]);

  console.log(value);
  const onchange = () => {};

  const onChangeSelectStatus = (value) => {
    dispatch(updateStatusUI({ taskId, newStatusId: value }));

    dispatch(updateStatus({ taskId, newStatusId: value }));
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={null} className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex space-x-7">
            <div className="w-6/12">
              <h2 className="text-xl mb-4 font-semibold">
                {taskDetail.taskName}
              </h2>
              <div>
                {/* description */}
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                {isEditing ? (
                  <div>
                    <Textarea
                      placeholder="add description"
                      className="border-gray-200 shadow w-full p-2 "
                      id="description"
                      name="description"
                      //   onFocus={() => setIsEditing(true)}
                      onBlur={(e) => {
                        // Nếu mất focus mà không bấm vào nút thì ẩn nút
                        setTimeout(() => setIsEditing(false), 200);
                      }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button onClick={() => alert("Saved: " + text)} size="sm">
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          //   setText("");
                          setIsEditing(false);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Input
                      // value={formik.values.description}
                      // onChange={formik.handleChange}
                      placeholder="add description"
                      className="border-gray-200 shadow w-full p-2 hover:bg-gray-200"
                      id="description"
                      name="description"
                      onFocus={() => setIsEditing(true)}
                      onBlur={(e) => {
                        // Nếu mất focus mà không bấm vào nút thì ẩn nút
                        setTimeout(() => setIsEditing(false), 200);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="w-6/12 space-y-4">
              <Select
                defaultValue={taskDetail?.statusId}
                onValueChange={(value) => {
                  onChangeSelectStatus(value);
                }}
              >
                <SelectTrigger className="w-full hover:bg-gray-200">
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allStatus?.map((item) => {
                      return (
                        <SelectItem key={item.statusId} value={item.statusId}>
                          {item.statusName}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/*  */}
              <div>
                {/* <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      // onClick={() => setOpen(true)}
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? frameworks.find(
                            (framework) => framework.value === value
                          )?.label
                        : "Select framework..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0"> */}
                <div className="flex">
                  <Label className="w-1/3">Assignees</Label>
                  <Command className="w-2/3" open={open} onOpenChange={setOpen}>
                    {/* <CommandInput
                    placeholder="Search framework..."
                    className="h-9"
                    value={value}
                  /> */}
                    {value === "" ? (
                      ""
                    ) : (
                      <Badge className="inline">{value}</Badge>
                    )}
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <ScrollArea className="h-40">
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              onClick={(e) => e.stopPropagation()}
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === framework.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </CommandList>
                  </Command>
                </div>
                {/* </PopoverContent>
                </Popover> */}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailTaskDialog;
