import React, { memo, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { Check, X } from "lucide-react";
import {
  getTaskDetail,
  setTaskDetail,
  updateEstimate,
} from "@/store/slices/boardSlice";
import { getProjectById } from "@/store/slices/projectDetailSlice";
import useTaskAction from "@/lib/hook/useTaskAction";

const TaskEstimate = () => {
  const { taskDetail } = useSelector((state) => state.board);
  const [isEstimate, setIsEstimate] = useState(false);
  const [valueEstimate, setValueEstimate] = useState(0);
  const { updateEstimateAction } = useTaskAction();

  useEffect(() => {
    setValueEstimate(Number(taskDetail.originalEstimate) || 0);
  }, [taskDetail?.originalEstimate]);

  const handleEstimate = (isCheck) => {
    setIsEstimate(false);
    if (isCheck) {
      updateEstimateAction({
        taskId: taskDetail.taskId,
        originalEstimate: valueEstimate,
      });
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div className="w-2/12 text-sm font-semibold ">Estimate</div>
      <div className="w-9/12 ">
        <div>
          {isEstimate ? (
            <div className="flex items-center space-x-2">
              <Input
                className="w-full"
                value={valueEstimate}
                onChange={(e) => setValueEstimate(e.target.value)}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();

                  handleEstimate(true, e);
                }}
              >
                <Check className="w-4 h-4 " strokeWidth={3} />
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEstimate(false);
                }}
              >
                <X className="w-4 h-4 text-red-500" strokeWidth={3} />
              </Button>
            </div>
          ) : (
            <div
              className="hover:bg-gray-200 p-1.5 rounded-sm"
              onClick={() => setIsEstimate(true)}
            >
              <Badge className=" pointer-events-none bg-gray-300 text-gray-800 px-2 py-1">
                {valueEstimate}m
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TaskEstimate);
