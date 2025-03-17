import { projectService } from "@/lib/services/projectService";
import { userService } from "@/lib/services/userService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reducer from "./authSlice";

// get All user
export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  const response = await userService.getUser();
  return response.content;
});

// get Project By Id
export const getProjectById = createAsyncThunk(
  "projectDetail/getProjectById",
  async ({ projectId }) => {
    try {
      const response = await projectService.getProjectById(projectId);

      return { ...response.content };
    } catch (error) {}
  }
);

// get user by id
export const getUserByProjectId = createAsyncThunk(
  "projectDetail/getUserByProjectId",
  async ({ projectId }, thunkAPI) => {
    try {
      const response = await userService.getUserByProjectId(projectId);
      console.log(response);

      return response.content;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.content || "Failed",
      });
    }
  }
);

// Add user
export const addMember = createAsyncThunk(
  "projectDetail/AddMember",
  async ({ projectId, item }, thunkAPI) => {
    try {
      const response = await userService.assignUserToProject(
        projectId,
        item.userId
      );

      return item;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.content);
    }
  }
);

// Remove user
export const removedMember = createAsyncThunk(
  "projectDetail/removedMember",
  async ({ projectId, item }, thunkAPI) => {
    try {
      const response = await userService.removeUserFromProject(
        projectId,
        item.userId
      );
      return item;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.content);
    }
  }
);

const projectDetailSlice = createSlice({
  name: "projectDetail",
  initialState: {
    projectDetail: null,
    listUser: {
      allUser: [],
      loading: false,
      error: null,
    },
    membersInProject: {
      listMember: [],
      loadingListMember: false,
      errorListMember: null,
    },
  },
  reducers: {
    setProjectDetail: (state, action) => {
      state.projectDetail = { ...action.payload };
    },
    updateStatusUI: (state, action) => {
      const { taskId, newStatusId } = action.payload;

      if (!state.projectDetail) return;

      let movedTask = null;

      //  Xóa task khỏi danh sách cũ
      state.projectDetail.lstTask = state.projectDetail.lstTask.map(
        (status) => {
          return {
            ...status,
            lstTaskDeTail: status.lstTaskDeTail.filter((task) => {
              if (task.taskId.toString() === taskId) {
                movedTask = { ...task, statusId: newStatusId };
                return false; // Xóa task khỏi danh sách cũ
              }
              return true;
            }),
          };
        }
      );

      //  Thêm task vào danh sách mới
      if (movedTask) {
        state.projectDetail.lstTask.forEach((status) => {
          if (status.statusId.toString() === newStatusId) {
            status.lstTaskDeTail.push(movedTask);
          }
        });
      }
    },
    setMemberInProject: (state, action) => {
      const itemUser = action.payload;

      const findUser = state.membersInProject.listMember.find(
        (item) => item.userId === itemUser.userId
      );

      if (findUser) {
        state.membersInProject.listMember =
          state.membersInProject.listMember.filter(
            (member) => member.userId !== itemUser.userId
          );
      } else {
        state.membersInProject.listMember.push(itemUser);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.listUser.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.listUser.loading = false;
        state.listUser.allUser = action.payload;
        state.listUser.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.listUser.loading = false;
        state.listUser.error = action.error.message;
      })
      // get Project by Id
      .addCase(getProjectById.fulfilled, (state, action) => {
        const { ...newDataProjectDetail } = action.payload;

        state.projectDetail = {
          ...state.projectDetail,
          ...newDataProjectDetail,
        };
      })

      // Update Status Cập nhật lại ui
      // get user by id
      .addCase(getUserByProjectId.pending, (state) => {
        state.membersInProject.loadingListMember = true;
      })
      .addCase(getUserByProjectId.fulfilled, (state, action) => {
        state.membersInProject.listMember = action.payload;
        state.membersInProject.loadingListMember = false;

        state.membersInProject.errorListMember = null;
      })
      .addCase(getUserByProjectId.rejected, (state, action) => {
        state.membersInProject.loadingListMember = false;
        if (action.payload.status === 404) {
          state.membersInProject.detail = [];
        }
        state.membersInProject.errorListMember = action.payload?.message;
      });
  },
});
export const { updateStatusUI, setProjectDetail, setMemberInProject } =
  projectDetailSlice.actions;

export default projectDetailSlice.reducer;
