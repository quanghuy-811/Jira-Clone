import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectService } from "@/lib/services/projectService";

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

// getAll Project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData) => {
    const response = await projectService.createProject(projectData);
    return response;
  }
);
// get Project By Id

export const getProjectById = createAsyncThunk(
  "projects/getProjectById",
  async ({ projectId }) => {
    try {
      const response = await projectService.getProjectById(projectId);

      return { ...response.content };
    } catch (error) {}
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projectDetail: null,
    projectList: [],
    projectUser: null,
    loading: false,
    error: null,
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
    setProject: (state, action) => {
      state.projectList = action.payload;
    },
    setProjectUser: (state, actinon) => {
      state.projectUser = state.projectList.filter(
        (project) => project.creator.id === actinon.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      //get all project
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
      // get Project by Id
      .addCase(getProjectById.fulfilled, (state, action) => {
        const { ...newDataProjectDetail } = action.payload;

        state.projectDetail = {
          ...state.projectDetail,
          ...newDataProjectDetail,
        };
      })
      // create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projectList.push(action.payload);
      });
  },
});

export const { setProjectDetail, updateStatusUI, setProject, setProjectUser } =
  projectSlice.actions;

export default projectSlice.reducer;
