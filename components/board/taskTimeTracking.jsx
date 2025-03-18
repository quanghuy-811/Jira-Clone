import React, { memo, useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import useTaskAction from "@/lib/hook/useTaskAction";

const TaskTimeTracking = () => {
  const dispatch = useDispatch();
  const [openTimeTracking, setOpenTimeTracking] = useState(false);
  const [valueTime, setValueTime] = useState({
    timeTrackingSpent: 0,
    timeTrackingRemaining: 0,
  });
  const { taskDetail } = useSelector((state) => state.board);
  const { updateTimeTrackingAction } = useTaskAction();
  useEffect(() => {
    setValueTime((prev) => ({
      ...prev,
      timeTrackingSpent: Number(taskDetail?.timeTrackingSpent) || 0,
      timeTrackingRemaining: Number(taskDetail?.timeTrackingRemaining) || 0,
    }));
  }, [taskDetail, openTimeTracking]);

  const handleUpdateTimeTracking = () => {
    updateTimeTrackingAction({
      taskId: taskDetail.taskId,
      timeTrackingSpent: valueTime.timeTrackingSpent,
      timeTrackingRemaining: valueTime.timeTrackingRemaining,
      callback: () => setOpenTimeTracking(false),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 items-center">
      <div className="text-sm font-semibold ">Time tracking</div>
      <div className="md:col-span-3 mt-3 md:mt-0 ">
        <div
          onClick={() => setOpenTimeTracking(true)}
          className="hover:bg-gray-200 p-1.5 rounded-sm w-full flex-col"
        >
          <Progress
            value={
              (taskDetail?.timeTrackingSpent / taskDetail?.originalEstimate) *
              100
            }
            className="h-2 bg-gray-300 w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{taskDetail?.timeTrackingSpent}m logged</span>
            <span>{taskDetail?.timeTrackingRemaining}m remaining</span>
          </div>
        </div>
        {openTimeTracking && (
          <Dialog
            className="hide-close"
            open={openTimeTracking}
            onOpenChange={setOpenTimeTracking}
          >
            <DialogContent className="md:max-w-xl" aria-describedby={null}>
              <DialogTitle className="sr-only">timeTracking</DialogTitle>
              <div className="p-2 space-y-3 mt-5">
                <Progress
                  value={
                    (valueTime.timeTrackingSpent /
                      taskDetail?.originalEstimate) *
                    100
                  }
                  className="h-2 bg-gray-300 w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{valueTime.timeTrackingSpent}m logged</span>
                  <span>{valueTime.timeTrackingRemaining}m remaining</span>
                </div>

                <p className="text-sm text-gray-600">
                  The original estimate for this issue was
                  {/* {taskDetail.originalEstimate} */}
                  <Badge className=" pointer-events-none bg-gray-300 text-gray-800 ml-1 p-1">
                    {taskDetail.originalEstimate}m
                  </Badge>
                </p>

                <div className="flex items-center justify-between ">
                  <div>
                    <Label htmlFor="spent">Time spent</Label>
                    <Input
                      id="timeTrackingSpent"
                      value={valueTime.timeTrackingSpent}
                      className="col-span-2 h-8"
                      onChange={(e) => {
                        setValueTime((prev) => ({
                          ...prev,
                          [e.target.id]: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="remaining">Time remaining</Label>
                    <Input
                      id="timeTrackingRemaining"
                      value={valueTime.timeTrackingRemaining ?? ""}
                      className="col-span-2 h-8 !opacity-100 !cursor-text"
                      onChange={(e) => {
                        setValueTime((prev) => ({
                          ...prev,
                          [e.target.id]: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="space-x-2 flex justify-end">
                  <Button
                    className="btn"
                    onClick={() => {
                      handleUpdateTimeTracking();
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    className="hover:text-red-500 btn"
                    variant="ghost"
                    onClick={() => {
                      setOpenTimeTracking(false);
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default memo(TaskTimeTracking);
