"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { loginSuccess } from "@/store/slices/authSlice";

function AuthProvider({ children }) {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const userData = JSON.parse(localStorage.getItem("userData"));

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
    </Provider>
  );
}
