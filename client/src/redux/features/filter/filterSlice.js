import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  filteredProducts: [],
  filteredSales: [],
  filteredNewSales: [],
  filteredProductGroups: [],
  filteredProductsOutOfStock: [],
  filteredProductGroupsOutOfStock: [],
  filteredCustomers: [],
  filteredIncompletePayments: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_PRODUCTS(state, action) {
      const { products, search } = action.payload;

      const tempProducts = products?.filter(
        (product) =>
          product?.name?.toLowerCase().includes(search.toLowerCase()) ||
          product?.category?.toLowerCase().includes(search.toLowerCase()) ||
          product?.sku?.includes(search.toLowerCase())
      );

      state.filteredProducts = tempProducts;
    },
    FILTER_SALES(state, action) {
      const { sales, search } = action.payload;

      const tempProducts = sales.filter(
        (sale) =>
          sale.name.toLowerCase().includes(search.toLowerCase()) ||
          sale.category.toLowerCase().includes(search.toLowerCase()) ||
          sale.quantity.includes(search.toLowerCase())
      );

      state.filteredSales = tempProducts;
    },
    FILTER_NEW_SALES(state, action) {
      const { checkouts, search } = action.payload;

      // console.log("checkouts", checkouts);

      const tempProducts = checkouts.filter(
        (sale) =>
          sale.items.some((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          ) ||
          sale.customer.name.toLowerCase().includes(search.toLowerCase()) ||
          sale.orderId?.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredNewSales = tempProducts;
    },
    FILTER_CUSTOMERS(state, action) {
      const { customers, search } = action.payload;

      // console.log("checkouts", customers);
      const tempProducts = customers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredCustomers = tempProducts;
    },
    FILTER_OUT_OF_STOCK_PRODUCTS(state, action) {
      const { productsOutOfStock, search } = action.payload;

      const tempProducts = productsOutOfStock.filter((productOutOfStock) => {
        return (
          productOutOfStock.name.toLowerCase().includes(search.toLowerCase()) ||
          productOutOfStock.category
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          productOutOfStock.quantity.toString().includes(search.toLowerCase()) // Convert quantity to string
        );
      });

      state.filteredProductsOutOfStock = tempProducts;
    },
    FILTER_OUT_OF_STOCK_PRODUCT_GROUPS(state, action) {
      const { productGroupOutOfStock, search } = action.payload;

      const tempProducts = productGroupOutOfStock.filter(
        (productGroup) =>
          productGroup.groupName.toLowerCase().includes(search.toLowerCase()) ||
          productGroup.category.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredProductGroupsOutOfStock = tempProducts;
    },
    FILTER_INCOMPLETE_PAYMENTS(state, action) {
      const { incompletePayments, search } = action.payload;

      const tempProducts = incompletePayments.filter(
        (incomplete) =>
          incomplete.items.some((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          ) ||
          incomplete.customer.name.toLowerCase().includes(search.toLowerCase())
      );

      // console.log(tempProducts, " : TempfilteredSales ");
      state.filteredIncompletePayments = tempProducts;
    },
    FILTER_PRODUCT_GROUPS(state, action) {
      const { productGroups, search } = action.payload;

      const tempProducts = productGroups?.filter((productGroup) => {
        const format = "DD-MM-YYYY h:mmA";
        const formattedDate = moment(productGroup.createdAt).format(format);

        return (
          productGroup.groupName.toLowerCase().includes(search.toLowerCase()) ||
          productGroup.category.toLowerCase().includes(search.toLowerCase()) ||
          formattedDate.includes(search)
        );
        // productGroup.quantity.includes(search.toLowerCase())
      });

      // console.log(tempProducts, " : TempfilteredSales ");
      state.filteredProductGroups = tempProducts;
    },
  },
});

export const {
  FILTER_PRODUCTS,
  FILTER_SALES,
  FILTER_NEW_SALES,
  FILTER_OUT_OF_STOCK_PRODUCTS,
  FILTER_OUT_OF_STOCK_PRODUCT_GROUPS,
  FILTER_CUSTOMERS,
  FILTER_INCOMPLETE_PAYMENTS,
  FILTER_PRODUCT_GROUPS,
} = filterSlice.actions;

export const selectFilteredPoducts = (state) => state.filter.filteredProducts;
export const selectFilteredSales = (state) => state.filter.filteredSales;
export const selectFilteredNewSales = (state) => state.filter.filteredNewSales;
export const selectFilteredProductsOutOfStock = (state) =>
  state.filter.filteredProductsOutOfStock;
export const selectFilteredProductGroupOutOfStock = (state) =>
  state.filter.filteredProductGroupsOutOfStock;
export const selectFilteredProductGroups = (state) =>
  state.filter.filteredProductGroups;
export const selectFilteredFulfilments = (state) =>
  state.filter.filteredIncompletePayments;
export const selectFilteredCustomers = (state) =>
  state.filter.filteredCustomers;

export default filterSlice.reducer;
