import { boardService } from "@/lib/services/broadService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getTaskDetail = createAsyncThunk(
  "board/getTaskDetail",
  async (taskId) => {
    try {
      const response = await boardService.getTaskDetail(taskId);
      return response.content;
    } catch (error) {
      console.log(error);
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

const boardSlice = createSlice({
  name: "board",
  initialState: {
    taskDetail: {},
    loading: false,
    error: null,

    tasks: [],
    allStatus: [],
    allPriority: [],
    allTaskType: [],
  },
  reducers: {
    setBoardData: (state, action) => {
      state.allStatus = action.payload.allStatus;
      state.allPriority = action.payload.allPriority;
      state.allTaskType = action.payload.allTaskType;
      state.tasks = action.payload.resProjectById.lstTask;
    },

    updateStatusUI: (state, action) => {
      const { taskId, newStatusId } = action.payload;

      let movedTask = null;

      //  Loại bỏ task khỏi column cũ
      state.tasks = state.tasks.map((status) => {
        return {
          ...status,
          lstTaskDeTail: status.lstTaskDeTail.filter((task) => {
            if (task.taskId.toString() === taskId.toString()) {
              movedTask = { ...task, statusId: newStatusId }; // Lưu task để di chuyển
              return false; // Xóa khỏi danh sách cũ
            }
            return true;
          }),
        };
      });

      // 2️⃣ Thêm task vào column mới
      if (movedTask) {
        state.tasks = state.tasks.map((status) =>
          status.statusId.toString() === newStatusId.toString()
            ? {
                ...status,
                lstTaskDeTail: [...status.lstTaskDeTail, movedTask],
              }
            : status
        );
      }
      // Cập nhật taskDetail nếu nó đang mở
      if (state.taskDetail?.taskId?.toString() === taskId.toString()) {
        state.taskDetail.statusId = newStatusId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaskDetail.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTaskDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.taskDetail = action.payload;
        state.error = null;
      })
      .addCase(getTaskDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateStatus.pending, (state, action) => {});
  },
});

export const { setBoardData, updateStatusUI } = boardSlice.actions;

export default boardSlice.reducer;
