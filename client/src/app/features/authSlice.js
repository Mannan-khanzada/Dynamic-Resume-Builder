import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
        loading: true,
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.loading = false;
            localStorage.setItem('token', action.payload.token); // save token
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.loading = false;
            localStorage.removeItem('token');
        },
        setUser: (state, action) => {  // for fetching user on page reload
            state.user = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { login, logout, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;