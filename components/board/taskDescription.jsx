import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { getTaskDetail, updateDescription } from "@/store/slices/boardSlice";
import { getProjectById } from "@/store/slices/projectDetailSlice";
import useTaskAction from "@/lib/hook/useTaskAction";

const TaskDescription = ({ taskId }) => {
  const { taskDetail } = useSelector((state) => state.board);
  const { projectDetail } = useSelector((state) => state.detailProject);
  const [description, setDescription] = useState(taskDetail.description || "");

  const [isDescription, setIsDescription] = useState(false);
  const dispatch = useDispatch();
  const { updateDescriptionAction } = useTaskAction();

  const handleUpdateDescription = () => {
    updateDescriptionAction({ taskId, description: description });
  };

  useEffect(() => {
    setDescription(taskDetail.description);
  }, [taskDetail]);
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
            onBlur={(e) => {
              // Nếu mất focus mà không bấm vào nút thì ẩn nút
              setTimeout(() => setIsDescription(false), 200);
            }}
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
            {description || "Click to add description... "}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
