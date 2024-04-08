import { configureStore } from "@reduxjs/toolkit";
import userReducers from "../slice/usersSlice";
import productReducers from "../slice/productsSlice";
import categoryReducers from "../slice/categoriesSlice";
import brandReducers from "../slice/brandsSlice";
import colorReducers from "../slice/colorsSlice";
import couponReducers from "../slice/couponsSlice";

// STORE
const store = configureStore({
    reducer: {
        users: userReducers,
        products: productReducers,
        categories: categoryReducers,
        brands: brandReducers,
        colors: colorReducers,
        coupons: couponReducers
    }
});

export default store;
