import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import {resetErrorAction} from "./globalActions";

// Initial State for our apps
const initialState = {
    loading: false,
    error: null,
    users: [],
    user: null,
    profile: {},
    // for authentication purposes
    userAuth: {
        loading: false,
        error: null,
        userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
    },
};

// Login Action
export const loginUserAction = createAsyncThunk('users/login', async ({ email, password }, { rejectWithValue, getState, dispatch }) => {
    try {
        // Make Http Request
        const { data } = await axios.post(`${baseURL}/users/login`, {
            email,
            password
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

        return data
    } catch(error) {
        // receiving error message from Backend
        return rejectWithValue(error?.response?.data)
    }
});

// Register Action
export const registerUserAction = createAsyncThunk('users/register', async ({ fullname, email, password }, { rejectWithValue, getState, dispatch }) => {
    try {
        // Make Http Request
        const { data } = await axios.post(`${baseURL}/users/register`, {
            fullname,
            email,
            password
        });
        
        return data
    } catch(error) {
        // receiving error message from Backend
        return rejectWithValue(error?.response?.data)
    }
});


// Users slice
const usersSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builder) => {
        // handle Actions
        // login has three status: Pending, Rejected and Fullfilled
        builder.addCase(loginUserAction.pending, (state, action) => {
            state.userAuth.loading = true;
        });

        builder.addCase(loginUserAction.fulfilled, (state, action) => {
            state.userAuth.userInfo = action.payload;
            state.userAuth.loading = false;
        });

        builder.addCase(loginUserAction.rejected, (state, action) => {
            state.userAuth.error = action.payload
            state.userAuth.loading = false;
        });

        // Register also has three status
        builder.addCase(registerUserAction.pending, (state, action) => {
            state.loading = true
        });

        builder.addCase(registerUserAction.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
        });

        builder.addCase(registerUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        // reset error action
        builder.addCase(resetErrorAction.pending, (state) => {
            // reset error state when login
            state.userAuth.error = null;

            // reset error state when registration
            state.error = null
        });
    }
});

// Generate Reducers
const userReducers = usersSlice.reducer;

export default userReducers;