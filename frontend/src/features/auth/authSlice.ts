import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../auth/types/auth.types";

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { authStart, authSuccess, authFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
