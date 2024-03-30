const { createAsyncThunk } = require("@reduxjs/toolkit");

// reset error

export const resetErrorAction = createAsyncThunk(
    "resetError-Action", () => {
        return {}
    }
);

// reset success
export const resetSuccessAction = createAsyncThunk(
    "resetSuccess-Action", () => {
        return {}
    }
)