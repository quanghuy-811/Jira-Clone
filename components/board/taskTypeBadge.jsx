import { SquareCheck, SquareDot } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const TaskTypeBadge = ({ taskType }) => {
  const taskTypeMap = {
    bug: {
      icon: SquareDot,
      color: "#d21e1e",
      name: "bug",
    },
    "new task": {
      icon: SquareCheck,
      color: "#68deee",
      name: "new task",
    },
  };

  const { color, name, icon: Icon } = taskTypeMap[taskType];

  return (
    <div>
      {Icon && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon
                size={17}
                strokeWidth={3}
                absoluteStrokeWidth
                color={color}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">{name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default TaskTypeBadge;
