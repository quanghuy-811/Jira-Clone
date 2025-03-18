import {
  deleteComment,
  getTaskDetail,
  insertComment,
  updateComment,
} from "@/store/slices/boardSlice";
import { getProjectById } from "@/store/slices/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useCommentAction = () => {
  const { projectDetail } = useSelector((state) => state.projects);

  const dispatch = useDispatch();
  const editComment = async ({ idComment, contentComment, taskId }) => {
    try {
      await dispatch(
        updateComment({
          idComment,
          contentComment,
        })
      ).unwrap();

      dispatch(getTaskDetail({ taskId }));
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      toast.warning("Edit comment faild");
    }
  };

  const addComment = async ({ taskId, contentComment }) => {
    try {
      await dispatch(
        insertComment({
          taskId,
          contentComment,
        })
      ).unwrap();

      dispatch(getTaskDetail({ taskId }));
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      console.log("error: ", error);
      toast.warning("Add comment faild");
    }
  };

  const delComment = async ({ taskId, idComment }) => {
    try {
      await dispatch(
        deleteComment({
          idComment,
        })
      ).unwrap();

      dispatch(getTaskDetail({ taskId }));
      dispatch(getProjectById({ projectId: projectDetail.id }));
    } catch (error) {
      toast.warning("Delete comment faild");
    }
  };

  return { editComment, addComment, delComment };
};

export default useCommentAction;
