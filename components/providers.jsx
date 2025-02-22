"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { loginSuccess } from "@/store/slices/authSlice";
import { getClientAuthToken } from "@/lib/utils";
import { Toaster } from "sonner";

function AuthProvider({ children }) {
  useEffect(() => {
    const token = getClientAuthToken("accessToken");

    if (token) {
      const userData = getClientAuthToken("userData");

      if (userData) {
        store.dispatch(
          loginSuccess({
            accessToken: token,
            user: userData,
            isAuthenticated: true,
          })
        );
      }
    }
  }, []);

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
