import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import detailProjectReducer from "./slices/projectDetailSlice";
import boardReducer from "./slices/boardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    detailProject: detailProjectReducer,
    board: boardReducer,
  },
});
