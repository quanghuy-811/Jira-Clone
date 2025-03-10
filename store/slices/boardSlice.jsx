import { boardService } from "@/lib/services/broadService";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getTaskDetail = createAsyncThunk(
  "board/getTaskDetail",
  async ({ taskId }) => {
    try {
      const response = await boardService.getTaskDetail(taskId);

      return response.content;
    } catch (error) {}
  }
);

export const updateDescription = createAsyncThunk(
  "board/updateDescription",
  async ({ taskId, description }, { rejectWithValue }) => {
    try {
      const response = await boardService.updateDescription(
        taskId,
        description
      );

      return response.content;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const updateStatus = createAsyncThunk(
  "board/updateStatus",
  async ({ taskId, newStatusId }) => {
    try {
      const response = await boardService.updateStatus(taskId, newStatusId);

      return { taskId, newStatusId };
    } catch (error) {}
  }
);
export const updatePriority = createAsyncThunk(
  "board/updatePriority",
  async ({ taskId, priorityId }, { rejectWithValue }) => {
    try {
      const response = await boardService.updatePriority(taskId, priorityId);

      return { taskId, priorityId };
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const updateTask = createAsyncThunk(
  "board/updateTask",
  async ({ valueUpdateTask }, thunkApi) => {
    try {
      const response = await boardService.updateTask(valueUpdateTask);

      return response.content;
    } catch (error) {}
  }
);

export const updateEstimate = createAsyncThunk(
  "board/updateEstimate",
  async ({ taskId, originalEstimate }, { rejectWithValue }) => {
    try {
      const response = await boardService.updateEstimate(
        taskId,
        originalEstimate
      );

      return response.content;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const updateTimeTracking = createAsyncThunk(
  "board/updateEstimate",
  async (
    { taskId, timeTrackingSpent, timeTrackingRemaining },
    { rejectWithValue }
  ) => {
    try {
      const response = await boardService.updateTimeTracking(
        taskId,
        timeTrackingSpent,
        timeTrackingRemaining
      );

      return response.content;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const insertComment = createAsyncThunk(
  "board/insertComment",
  async ({ taskId, contentComment }) => {
    try {
      const response = await boardService.insertComment(taskId, contentComment);

      return response.content;
    } catch (error) {}
  }
);

export const updateComment = createAsyncThunk(
  "board/updateComment",
  async ({ idComment, contentComment }) => {
    try {
      const response = await boardService.updateComment(
        idComment,
        contentComment
      );

      return response.content;
    } catch (error) {}
  }
);
export const deleteComment = createAsyncThunk(
  "board/deleteComment",
  async ({ idComment }) => {
    try {
      const response = await boardService.deleteComment(idComment);

      return response.content;
    } catch (error) {}
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: {
    taskDetail: null,

    allStatus: [],
    allPriority: [],
    allTaskType: [],
  },
  reducers: {
    setBoardData: (state, action) => {
      state.allStatus = action.payload.allStatus;
      state.allPriority = action.payload.allPriority;
      state.allTaskType = action.payload.allTaskType;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTaskDetail.fulfilled, (state, action) => {
      const { ...newData } = action.payload;
      state.taskDetail = { ...state.taskDetail, ...newData };
    });
  },
});

export const { setBoardData, updateAssigneeUI } = boardSlice.actions;

export default boardSlice.reducer;
