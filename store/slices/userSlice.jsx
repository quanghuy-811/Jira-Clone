import { userService } from "@/lib/services/userService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// get All user
export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  const response = await userService.getUser();
  return response.content;
});

// get user by id
export const getUserByProjectId = createAsyncThunk(
  "user/getUserByProjectId",
  async ({ projectId }, thunkAPI) => {
    try {
      const response = await userService.getUserByProjectId(projectId);

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
  "user/AddMember",
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
  "user/removedMember",
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

const userSlice = createSlice({
  name: "user",
  initialState: {
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
export const { setMemberInProject } = userSlice.actions;

export default userSlice.reducer;
