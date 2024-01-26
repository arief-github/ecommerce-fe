import {createAsyncThunk} from "@reduxjs/toolkit";

export const resetErrorAction = createAsyncThunk('resetError', () => {
    return {};
});

export const resetSuccessAction = createAsyncThunk('resetSuccess', () => {
    return {};
})