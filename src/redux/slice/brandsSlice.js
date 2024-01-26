import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import baseURL from "../../utils/baseURL";
import axios from "axios";

// Initial State for Brands
const initialState = {
    brands: [],
    brand : {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false
}

// Fetch All Brands
export const fetchBrandsAction = createAsyncThunk("brand/fetchAll", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { data } = await axios.get(`${baseURL}/brands`);

        return data
    } catch(error) {
        return rejectWithValue(error?.response?.data);
    }
});

// slice
const brandSlice = createSlice({
    name: "brands",
    initialState,
    extraReducers: (builder) => {
        // Fetch All
        builder.addCase(fetchBrandsAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(fetchBrandsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brands = action.payload;
            state.isAdded = true;
        });

        builder.addCase(fetchBrandsAction.rejected, (state, action) => {
            state.loading = false;
            state.brands = null;
            state.isAdded = false;
            state.error = action.payload;
        })
    }
})

const brandReducers = brandSlice.reducer;

export default brandReducers;
