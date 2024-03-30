import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../utils/baseURL";
import axios from "axios";
import { resetSuccessAction, resetErrorAction } from "./globalActions";

// Initial State
const initialState = {
    colors: [],
    color: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false
};

// create color action
export const createColorAction = createAsyncThunk("colors/create", async (name, { rejectWithValue, getState, dispatch }) => {
    try {
        // Token Auth
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post(`${baseURL}/colors`, { name }, config);

        return data
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
});

// Fetch Color Action
export const fetchColorAction = createAsyncThunk("colors/fetchAll", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { data } = await axios.get(`${baseURL}/colors`);

        return data;
    } catch (error) {
        rejectWithValue(error?.response?.data)
    }
})

// Colors Slice
const colorSlices = createSlice({
    name: "colors",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(createColorAction.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(createColorAction.fulfilled, (state, action) => {
            state.loading = false;
            state.color = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createColorAction.rejected, (state, action) => {
            state.loading = false;
            state.color = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // Fetch
        builder.addCase(fetchColorAction.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchColorAction.fulfilled, (state, action) => {
            state.loading = false;
            state.colors = action.payload;
        });

        builder.addCase(fetchColorAction.rejected, (state, action) => {
            state.loading = false;
            state.colors = null;
            state.isAdded = false;
            state.error = action.payload;
        });

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

// Generate the reducer
const colorReducers = colorSlices.reducer;

export default colorReducers;