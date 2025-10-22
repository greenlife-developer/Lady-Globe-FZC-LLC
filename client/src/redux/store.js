import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import trendyolDataReducer from "../redux/features/trendyol/slice";
import messageReducer from "../redux/features/messages/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trendyolData: trendyolDataReducer,
    messages: messageReducer
  },
});
