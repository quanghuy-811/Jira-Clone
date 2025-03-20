"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { loginSuccess } from "@/store/slices/authSlice";
import { getClientAuthToken } from "@/lib/utils";
import { Toaster } from "sonner";
import { getTaskInfo } from "@/store/slices/boardSlice";

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = getClientAuthToken("accessToken");

  useEffect(() => {
    if (token) {
      const userData = getClientAuthToken("userData");

      if (userData) {
        dispatch(
          loginSuccess({
            accessToken: token,
            user: userData,
            isAuthenticated: true,
          })
        );
      }
    }
  }, [token]);
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getTaskInfo());
    }
  }, [isAuthenticated]);

  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster richColors position="top-right" />
    </Provider>
  );
}
