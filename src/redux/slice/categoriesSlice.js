import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import baseURL from "../../utils/baseURL";
import axios from "axios";

// Initial State for Categories
const initialState = {
    categories: [],
    category: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false
}

// Create Category Action
export const createCategoryAction = createAsyncThunk(
    "category/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name } = payload;

            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };

            const { data } = await axios.post(`${baseURL}/categories`, { name }, config);

            return data
        } catch(error) {
            return rejectWithValue(error?.response?.data)
        }
    }
)

export const fetchCategoriesAction = createAsyncThunk(
    "category/fetchAll",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.get(`${baseURL}/categories`);

            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
)

//slice
const categorySlice = createSlice({
    name: "categories",
    initialState,
    extraReducers: (builder) => {
        // create categories
        builder.addCase(createCategoryAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(createCategoryAction.fulfilled, (state, action) => {
            state.loading = false;
            state.category = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createCategoryAction.rejected, (state, action) => {
            state.loading = false;
            state.category = null;
            state.isAdded = false;
            state.error = action.payload;
        })

        // Fetch All
        builder.addCase(fetchCategoriesAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
            state.isAdded = true;
        });

        builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
            state.loading = false;
            state.categories = null;
            state.isAdded = false;
            state.error = action.payload;
        })
    }
})

// Generate the reducer
const categoryReducers = categorySlice.reducer;

export default categoryReducers;