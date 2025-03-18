import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useTaskAction from "@/lib/hook/useTaskAction";

const TaskDescription = ({ taskId }) => {
  const router = useRouter();
  const { taskDetail } = useSelector((state) => state.board);
  const [description, setDescription] = useState(taskDetail.description || "");
  const [isDescription, setIsDescription] = useState(false);
  const { updateDescriptionAction } = useTaskAction();

  const handleUpdateDescription = () => {
    updateDescriptionAction({
      taskId,
      description,
      callBack: () => setIsDescription(false),
    });
  };

  useEffect(() => {
    setDescription(taskDetail.description);
  }, [taskDetail.description]);

  return (
    <div>
      <label className="block text-sm font-semibold mb-2" htmlFor="description">
        Description
      </label>
      {isDescription ? (
        <div>
          <Textarea
            placeholder="add description"
            className="border border-gray-200 w-full p-2 
        focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-300"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button size="sm" onClick={() => handleUpdateDescription()}>
              Save
            </Button>
            <Button
              className="hover:text-red-400"
              onClick={() => {
                setIsDescription(false);
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="p-1.5 hover:bg-gray-200 rounded-sm bg-gray-100"
          onClick={() => setIsDescription(true)}
        >
          <p className="text-sm text-gray-700">
            {taskDetail.description || "Click to add description... "}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
