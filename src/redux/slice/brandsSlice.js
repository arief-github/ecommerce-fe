import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resetErrorAction, resetSuccessAction } from "./globalActions";
import baseURL from "../../utils/baseURL";
import axios from "axios";

// Initial State for Brands
const initialState = {
    brands: [],
    brand: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false
}

// Create Brand Action
export const createBrandAction = createAsyncThunk("brand/create", async (name, { rejectWithValue, getState, dispatch }) => {
    try {

        // token auth
        const token = getState()?.users?.userAuth?.userInfo?.token;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await axios.post(
            `${baseURL}/brands`,
            { name },
            config
        );

        return data;

    } catch (e) {
        rejectWithValue(e?.response?.data)
    }
})

// Fetch All Brands
export const fetchBrandsAction = createAsyncThunk("brand/fetchAll", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { data } = await axios.get(`${baseURL}/brands`);

        return data
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

// slice
const brandSlice = createSlice({
    name: "brands",
    initialState,
    extraReducers: (builder) => {
        // create
        builder.addCase(createBrandAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createBrandAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brand = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.brand = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // Fetch All
        builder.addCase(fetchBrandsAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(fetchBrandsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brands = action.payload;
        });

        builder.addCase(fetchBrandsAction.rejected, (state, action) => {
            state.loading = false;
            state.brands = null;
            state.error = action.payload;
        })

        //reset error action
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.isAdded = false;
            state.error = null;
        });
        //reset success action
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
            state.error = null;
        });
    }
})

const brandReducers = brandSlice.reducer;

export default brandReducers;
