import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trendyolDataService from "./service";
import { toast } from "sonner";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  inventory: [],
  excludedProducts: [],
};

// Get amazon orders
export const getInventory = createAsyncThunk(
  "inventory/getInventory",
  async (_, thunkAPI) => {
    try {
      return await trendyolDataService.getInventory();
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

// update price thunk
export const updatePrice = createAsyncThunk(
  "inventory/updatePrice",
  async (formData, thunkAPI) => {
    try {
      return await trendyolDataService.updatePrice(formData);
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

// exclude product thunk
export const addToExcludedProducts = createAsyncThunk(
  "product/excludeProduct",
  async (formData, thunkAPI) => {
    try {
      return await trendyolDataService.excludeProduct(formData);
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

export const removeFromExcluded = createAsyncThunk(
  "product/removeFromExcluded",
  async (productCode, thunkAPI) => {
    try {
      return await trendyolDataService.removeFromExcluded(productCode);
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

export const getExcludedProducts = createAsyncThunk(
  "product/getExcludedProducts",
  async (_, thunkAPI) => { 
    try {
      return await trendyolDataService.getInactiveProducts();
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

const trendyolDataSlice = createSlice({
  name: "amazonData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInventory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        state.inventory = action.payload.products;

        toast.dismiss();
        toast.success("Inventory fetched successfully");
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(updatePrice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePrice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        // state.inventory = action.payload.products;

        toast.dismiss();
        toast.success("Price updated successfully");
      })
      .addCase(updatePrice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(addToExcludedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToExcludedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        // state.inventory = action.payload.products;
        // state.excludedProducts = action.payload.products;

        toast.dismiss();
        toast.success("Product excluded from scrapping");
      })
      .addCase(addToExcludedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(getExcludedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExcludedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        state.excludedProducts = [ ...action.payload.products ];

        toast.dismiss();
      })
      .addCase(getExcludedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      .addCase(removeFromExcluded.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromExcluded.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        toast.dismiss();
        toast.success("Product added for scrapping");
      })
      .addCase(removeFromExcluded.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.dismiss();
        toast.error(action.payload);
      })
      ;
  },
});

export const selectIsLoading = (state) => state.amazonData.isLoading;
export const selectInventory = (state) => state.amazonData.inventory;

export default trendyolDataSlice.reducer;
