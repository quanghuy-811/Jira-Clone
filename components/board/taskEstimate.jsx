import React, { memo, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { Check, X } from "lucide-react";
import useTaskAction from "@/lib/hook/useTaskAction";

const TaskEstimate = () => {
  const { taskDetail } = useSelector((state) => state.board);
  const [isEstimate, setIsEstimate] = useState(false);
  const { updateEstimateAction } = useTaskAction();
  const valueEstimateRef = useRef(0);

  useEffect(() => {
    valueEstimateRef.current = Number(taskDetail.originalEstimate || 0);
  }, [taskDetail.originalEstimate]);

  const handleEstimate = (isCheck) => {
    if (isCheck) {
      updateEstimateAction({
        taskId: taskDetail.taskId,
        originalEstimate: valueEstimateRef.current,
        callBack: () => setIsEstimate(false),
      });
    } else {
      setIsEstimate(false);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 items-center">
      <div className="text-sm font-semibold ">Estimate</div>
      <div className="md:col-span-3 mt-3 md:mt-0">
        <div>
          {isEstimate ? (
            <div className="flex items-center space-x-2">
              <Input
                className="w-full"
                defaultValue={valueEstimateRef.current}
                onChange={(e) => (valueEstimateRef.current = e.target.value)}
              />
              <Button
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();

                  handleEstimate(true, e);
                }}
              >
                <Check className="w-4 h-4 " strokeWidth={3} />
              </Button>
              <Button
                className="btn"
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
                {taskDetail.originalEstimate}m
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TaskEstimate);
