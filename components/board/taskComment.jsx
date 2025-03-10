import React, { useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { SelectSeparator } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import {
  deleteComment,
  getTaskDetail,
  insertComment,
  updateComment,
} from "@/store/slices/boardSlice";
import { getProjectById } from "@/store/slices/projectDetailSlice";
import { Input } from "../ui/input";
import { toast } from "sonner";
import useCommentAction from "@/lib/hook/useCommentAction";

const TaskComment = ({ taskId }) => {
  const { taskDetail } = useSelector((state) => state.board, shallowEqual);
  const { projectDetail } = useSelector((state) => state.detailProject);
  const { user } = useSelector((state) => state.auth);

  const [editCommentId, setEditComentId] = useState(null);
  const [isComment, setIsComment] = useState(false);
  const dispatch = useDispatch();
  const { editComment, addComment, delComment } = useCommentAction();
  const commentRefs = useRef({});
  const commentRefAdd = useRef(null);

  console.log(taskDetail);
  const handleEditComment = (idComment) => {
    editComment({
      idComment,
      contentComment: commentRefs.current[idComment].value,
      taskId,
    });
  };

  const handleAddComment = () => {
    if (!commentRefAdd.current) return;

    addComment({
      taskId,
      contentComment: commentRefAdd.current.value,
    });
  };

  const onClickEdit = (idComment) => {
    setEditComentId(idComment);
  };
  const handleDeleteComment = (idComment) => {
    delComment({ taskId, idComment });
  };
  return (
    <div className="space-y-5">
      <div className="w-2/12 text-sm font-semibold ">Comment</div>

      <div className="flex space-x-3">
        <div className="w-1/12">
          {user?.avatar ? (
            <img className=" h-8 w-8 rounded-full" src={user?.avatar} alt="" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
              ?
            </div>
          )}
        </div>
        <div className="flex-1">
          {isComment ? (
            <div>
              <Textarea
                placeholder="Add comment..."
                className="border border-gray-200 w-full p-2 
                                       focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-300"
                id="description"
                name="description"
                onBlur={(e) => {
                  // Nếu mất focus mà không bấm vào nút thì ẩn nút
                  setTimeout(() => setIsComment(false), 200);
                }}
                ref={commentRefAdd}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button size="sm" onClick={() => handleAddComment()}>
                  Save
                </Button>
                <Button
                  className="hover:text-red-400"
                  onClick={() => {
                    setIsComment(false);
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
              onClick={() => setIsComment(true)}
            >
              <p className="text-sm text-gray-700">Click to add comment...</p>
            </div>
          )}
        </div>
      </div>

      {[...taskDetail?.lstComment].reverse().map((item) => {
        return (
          <div
            key={item.id}
            className="flex space-x-3 border-b pb-2 border-gray-200"
          >
            <div className="w-1/12">
              <img className=" h-8 w-8 rounded-full" src={item.avatar} alt="" />
            </div>
            <div className="flex-1 text-sm space-y-2">
              <h1 className="text-gray-900">{item.name}</h1>
              {editCommentId === item.id ? (
                <div>
                  <Textarea
                    className="border border-gray-200 w-full p-2 
                                            focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-300"
                    id="description"
                    name="description"
                    defaultValue={item.commentContent}
                    onBlur={(e) => {
                      // Nếu mất focus mà không bấm vào nút thì ẩn nút
                      setTimeout(() => setEditComentId(null), 200);
                    }}
                    ref={(el) => {
                      commentRefs.current[item.id] = el;
                    }}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditComment(item.id)}
                    >
                      Save
                    </Button>
                    <Button
                      className="hover:text-red-500"
                      onClick={() => setEditComentId(null)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-500">{item.commentContent}</p>
                  <div className="font-bold space-x-3">
                    <button
                      onClick={() => onClickEdit(item.id)}
                      className="p-0 hover:underline text-gray-600 font-semibold hover:text-gray-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(item.id)}
                      className="hover:underline text-gray-600 font-semibold hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskComment;
