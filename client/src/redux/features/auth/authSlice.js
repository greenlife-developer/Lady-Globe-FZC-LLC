import { createSlice } from "@reduxjs/toolkit";

let userName = localStorage.getItem("useName") || null;

const initialState = {
  isLoggedIn: false,
  userName: userName !== "undefined" ? JSON.parse(userName) : "",
  user: JSON.parse(localStorage.getItem("user")) || {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("userName", JSON.stringify(action.payload));
      state.userName = action.payload;
    },
    SET_USER(state, action) {
      const profile = action.payload;
      localStorage.setItem("user", JSON.stringify(profile));

      state.user = profile;
    },
    UPDATE_USER(state, action) {
      const user = action.payload;
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
  },
}); 

export const { SET_LOGIN, SET_NAME, SET_USER, UPDATE_USER } =
  authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.user.name;
export const selectUser = (state) => state.auth.user;


export default authSlice.reducer;
