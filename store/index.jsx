import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import userReducer from "./slices/userSlice";
import boardReducer from "./slices/boardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    user: userReducer,
    board: boardReducer,
  },
});
