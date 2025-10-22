import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messageService from "./messageService";
import { toast } from "sonner";

const initialState = {
  messageLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  messages: [],
  users: [],
};

// Get all messages
export const getAllMessages = createAsyncThunk(
  "messages/getAllMessages",
  async (formData, thunkAPI) => {
    try {
      return await messageService.getMessages(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const sendMessage = createAsyncThunk(
  "messages/sendANewMessage",
  async (formData, thunkAPI) => {
    try {
      return await messageService.sendMessage(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);



const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMessages.pending, (state) => {
        state.messageLoading = true;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        state.messageLoading = false;
        state.isSuccess = true;
        state.isError = false;

        state.messages = action.payload;

        toast.dismiss();
        // toast.success("Messages fetched successfully");
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        state.messageLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(sendMessage.pending, (state) => {
        state.messageLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageLoading = false;
        state.isSuccess = true;
        state.isError = false;

        state.messages.push(action.payload.message);

        toast.dismiss();
        toast.success("Message sent");
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      
      ;
  },
});

export const selectIsMessageLoading = (state) => state.messages.messageLoading;
export const selectMessages = (state) => state.messages.messages;

export default messageSlice.reducer;
