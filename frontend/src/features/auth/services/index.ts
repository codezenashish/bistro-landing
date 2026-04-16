import apiClient from "../../../api/apiClient";
import { authStart, authSuccess, authFailure } from "../authSlice";
import type { Dispatch } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const handleLogin = (credentials: any) => async (dispatch: Dispatch) => {
  dispatch(authStart());
  try {
    const response = await apiClient.post("/user/login", credentials);

    const { user, accessToken } = response.data.data;

    dispatch(authSuccess({ user, accessToken }));
    toast.success("Login Successful!");
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Something went wrong";
    dispatch(authFailure(errorMsg));
    toast.error(errorMsg);
  }
};
