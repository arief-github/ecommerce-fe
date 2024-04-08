import axios from "axios";
import baseURL from "../../utils/baseURL";
import { resetSuccessAction } from "./globalActions";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    coupons: [],
    coupon: null,
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false
};

// create coupon action
export const createCouponAction = createAsyncThunk('coupon/create', async ({ code, discount, startDate, endDate }, { rejectWithValue, getState, dispatch }) => {
    try {
        const token = getState()?.users?.userAuth?.userInfo?.token;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = axios.post(
            `${baseURL}/coupons`,
            {
                code,
                discount,
                startDate,
                endDate
            },
            config
        )

        return data

    } catch (e) {
        return rejectWithValue(e?.response?.data)
    }
});

// edit coupon action
export const updateCouponAction = createAsyncThunk('coupon/update', async ({ id, code, discount, startDate, endDate }, { rejectWithValue, getState, dispatch }) => {
    try {
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await axios.put(
            `${baseURL}/coupons/${id}/update`,
            {
                code,
                discount,
                startDate,
                endDate
            },
            config
        )

        return data

    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
});

// fetch coupons action
export const fetchCouponsAction = createAsyncThunk('coupon/fetchAll', async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { data } = await axios.get(`${baseURL}/coupons`);

        return data;
    } catch (e) {
        return rejectWithValue(e?.response?.data)
    }
});

// fetch coupon
export const fetchCouponAction = createAsyncThunk('coupon/single', async (code, { rejectWithValue, getState, dispatch }) => {
    try {
        const { data } = await axios.get(`${baseURL}/coupons/${code}`);
    } catch (e) {
        return rejectWithValue(e?.response?.data)
    }
});

// delete coupon action
export const deleteCouponAction = createAsyncThunk('coupon/delete', async (id, { rejectWithValue, getState, dispatch }) => {
    try {
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await axios.delete(
            `${baseURL}/coupons/${id}/delete`,
            config
        )

        return data;

    } catch (e) {
        return rejectWithValue(e?.response?.data)
    }
})

// slice
const couponSlice = createSlice({
    name: "coupons",
    initialState,
    extraReducers: (builder) => {
        //create
        builder.addCase(createCouponAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createCouponAction.fulfilled, (state, action) => {
            state.loading = false;
            state.coupon = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createCouponAction.rejected, (state, action) => {
            state.loading = false;
            state.coupon = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        //update
        builder.addCase(updateCouponAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateCouponAction.fulfilled, (state, action) => {
            state.loading = false;
            state.coupon = action.payload;
            state.isUpdated = true;
        });
        builder.addCase(updateCouponAction.rejected, (state, action) => {
            state.loading = false;
            state.coupon = null;
            state.isUpdated = false;
            state.error = action.payload;
        });

        //delete
        builder.addCase(deleteCouponAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteCouponAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isDelete = true;
        });
        builder.addCase(deleteCouponAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        //fetch all
        builder.addCase(fetchCouponsAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCouponsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.coupons = action.payload;
        });
        builder.addCase(fetchCouponsAction.rejected, (state, action) => {
            state.loading = false;
            state.coupons = null;

            state.error = action.payload;
        });

        //fetch single coupon
        builder.addCase(fetchCouponAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCouponAction.fulfilled, (state, action) => {
            state.loading = false;
            state.coupon = action.payload;
        });
        builder.addCase(fetchCouponAction.rejected, (state, action) => {
            state.loading = false;
            state.coupon = null;
            state.error = action.payload;
        });
    }
})

const couponReducers = couponSlice.reducer;

export default couponReducers;