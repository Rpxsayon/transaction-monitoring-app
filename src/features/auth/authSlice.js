import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    loginTime: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};
export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
    // simulate Api call 
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
        const user = { email, name: email.split('@')[0] };
        const loginTime = new Date().toISOString();
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('loginTime', loginTime);
        return { user, loginTime };
    }
    else {
        throw new Error("Invalid credentials!");
    }
});
export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
    const storedUser = localStorage.getItem("user");
    const storedLoginTime = localStorage.getItem("loginTime");
    if (storedUser) {
        return {
            user: JSON.parse(storedUser),
            loginTime: storedLoginTime,
        };
    }
});
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.loginTime = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('loginTime');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.loginTime = action.payload.loginTime;
            state.isAuthenticated = true;
            state.error = null;
        })
            .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Login faliled';
        })
            .addCase(checkAuth.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload.user;
                state.loginTime = action.payload.loginTime;
                state.isAuthenticated = true;
            }
        });
    },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
