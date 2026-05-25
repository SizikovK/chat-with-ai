import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
    id: string;
    nickname: string;
    email: string;
};

type AuthState = {
    user: AuthUser | null;
    isAuthenticated: boolean;
};

const initialState: AuthState = {
    user: null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        restoreAuth(state, action: PayloadAction<AuthUser | null>) {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
        },
        clearAuth(state) {
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setAuth, restoreAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
