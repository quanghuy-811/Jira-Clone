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
  async (projectId, thunkAPI) => {
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
    detailUser: {
      detail: [],
      loadingDetailUser: false,
      errorDetailUser: null,
    },
  },
  reducers: {},
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
        state.detailUser.loadingDetailUser = true;
      })
      .addCase(getUserByProjectId.fulfilled, (state, action) => {
        state.detailUser.detail = action.payload;
        state.detailUser.loadingDetailUser = false;

        state.detailUser.errorDetailUser = null;
      })
      .addCase(getUserByProjectId.rejected, (state, action) => {
        state.detailUser.loadingDetailUser = false;
        if (action.payload.status === 404) {
          state.detailUser.detail = [];
        }
        state.detailUser.errorDetailUser = action.payload?.message;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.detailUser.detail.push(action.payload);
      })
      .addCase(removedMember.fulfilled, (state, action) => {
        state.detailUser.detail = state.detailUser.detail.filter(
          (item) => item.userId !== action.payload.userId
        );
      });
  },
});

export default userSlice.reducer;
