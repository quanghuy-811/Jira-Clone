import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectService } from "@/lib/services/projectService";
import { addMember, removedMember } from "./projectDetailSlice";

// get all Project
export const fetchProject = createAsyncThunk(
  "projects/fetchProject",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await projectService.getAllProjects();
      return { response: response.content, user: auth?.user?.id };
    } catch (error) {
      console.log(error);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData) => {
    const response = await projectService.createProject(projectData);
    return response;
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projectUser: null,
    projectList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        const { response, user } = action.payload;
        state.loading = false;
        state.projectList = response;
        state.projectUser = state.projectList.filter(
          (project) => project.creator.id === user
        );
        state.error = null;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projectList.push(action.payload);
      })
      .addCase(addMember.fulfilled, (state, action) => {
        const project = state.projectList.find(
          (p) => p.id === action.meta.arg.projectId
        );
        if (project) {
          project.members.push(action.payload); // Thêm thành viên vào danh sách
        }
      })
      .addCase(removedMember.fulfilled, (state, action) => {
        const project = state.projectList.find(
          (p) => p.id === action.meta.arg.projectId
        );
        if (project) {
          project.members = project.members.filter(
            (m) => m.userId !== action.payload.userId
          );
        }
      });
  },
});

export default projectSlice.reducer;
