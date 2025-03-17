import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const editUser = createAsyncThunk("user/editUser", async () => {
  try {
  } catch (error) {}
});

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {},
});

export const {} = userSlice.actions;

export default userSlice.reducer;
