import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Jab aap Cart aur Menu features banayenge, unke reducers yahan add hote jayenge
  },
  // Middleware aur DevTools setup (Auto-enabled in RTK)
  devTools: import.meta.env.MODE !== "production",
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;