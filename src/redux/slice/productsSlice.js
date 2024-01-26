import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import baseURL from "../../utils/baseURL";
import axios from "axios";

// Initial State for Product
const initialState = {
    products: [],
    product: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false
};

// Create product action
export const createProductAction = createAsyncThunk('product/action', async (payload,  { rejectWithValue , getState, dispatch}) => {
    try {
        const { name, description, sizes, brand, colors, price } = payload;

        // get the token
        const token = getState().users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        //  make POST request
        const { data } = await axios.post(`${baseURL}/products`, {
            name,
            description,
            sizes,
            brand,
            colors,
            price
        }, config);

        return data;
    } catch(error) {
        return rejectWithValue(error?.response?.data)
    }
})

// slice
const productSlice = createSlice({
    name: "products",
    initialState,
    extraReducers: (builder) => {
        // create product
        builder.addCase(createProductAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(createProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.isAdded = false;
            state.error = action.payload;
        })
    }
});

// Generate the reducer
const productReducers = productSlice.reducer;

export default productReducers