import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../utils/baseURL";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "./globalActions";

// Initial State for Product
const initialState = {
    products: [],
    product: {},
    // total: 0,
    // paginationResult: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// Create product action
export const createProductAction = createAsyncThunk('product/create', async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { name, description, category, sizes, brand, colors, price, totalQty, files } = payload;

        // get the token
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }

        //Form data request
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("brand", brand);
        formData.append("price", price);
        formData.append("totalQty", totalQty);

        sizes.forEach((size) => {
            formData.append("sizes", size);
        });
        colors.forEach((color) => {
            formData.append("colors", color);
        });

        files.forEach((file) => {
            formData.append("files", file);
        });

        //  make POST request
        const { data } = await axios.post(`${baseURL}/products`, formData, config);

        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

// Fetch Product List
export const fetchProductsAction = createAsyncThunk('product/list', async ({ url }, { rejectWithValue, getState, dispatch }) => {
    try {
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        const { data } = await axios.get(`${url}`, config);

        const { products } = data
        //
        // return { products, total, paginationResult };

        return { products };

    } catch (e) {
        return rejectWithValue(e?.response?.data)
    }
}
)

// Fetch Product Action
export const fetchProductAction = createAsyncThunk('product/fetch', async (id, { rejectWithValue, getState, dispatch }) => {
    try {
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        const { data } = await axios.get(
            `${baseURL}/products/${id}`,
            config
        );

        return data;
    } catch (e) {
        return rejectWithValue(e?.response?.data)
    }
})

// Update product action
export const updateProductAction = createAsyncThunk('product/update', async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { id, name, description, category, sizes, brand, colors, price, totalQty, files } = payload;

        // get the token
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }

        const { data } = await axios.put(
            `${baseURL}/products/${id}/update`,
            {
                name,
                description,
                category,
                sizes,
                brand,
                colors,
                price,
                totalQty,
                files
            },
            config
        )

        return data;
    } catch (e) {
        rejectWithValue(e?.response?.data)
    }
})

// Delete product action
export const deleteProductAction = createAsyncThunk('product/delete', async (id, { rejectWithValue, getState, dispatch }) => {
    try {
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        const { data } = await axios.delete(
            `${baseURL}/products/${id}/delete`,
            config
        );

        return data
    }
    catch (e) {
        rejectWithValue(e?.response?.data)
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
            state.isAdded = false
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

        // fetch product list
        builder.addCase(fetchProductsAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(fetchProductsAction.fulfilled, (state, action) => {
            state.loading = false
            state.products = action.payload;
            state.total = action.payload;
            state.paginationResult = action.payload;
        });

        builder.addCase(fetchProductsAction.rejected, (state, action) => {
            state.loading = false;
            state.products = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // fetch single product
        builder.addCase(fetchProductAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(fetchProductAction.fulfilled, (state, action) => {
            state.loading = false
            state.product = action.payload;
            state.isAdded = true
        });

        builder.addCase(fetchProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        // update product
        builder.addCase(updateProductAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(updateProductAction.fulfilled, (state, action) => {
            state.loading = false
            state.product = action.payload
            state.isUpdated = true
        });

        builder.addCase(updateProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.isUpdated = false;
            state.error = action.payload;
        })

        // delete product
        builder.addCase(deleteProductAction.pending, (state) => {
            state.loading = true
        });

        builder.addCase(deleteProductAction.fulfilled, (state) => {
            state.loading = false
            state.isDeleted = true
        });

        // reset success
        builder.addCase(resetSuccessAction.pending, (state) => {
            state.isAdded = false
            state.isUpdated = false
        })

        builder.addCase(resetErrorAction.pending, (state) => {
            state.error = null
        })
    }
});

// Generate the reducer
const productReducers = productSlice.reducer;

export default productReducers