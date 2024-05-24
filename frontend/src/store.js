import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/userSlice/authSlice.js'
import { apiSlice } from './slices/apiSlice.js'
import adminAuthSlice from './slices/adminSlice/adminAuthSlice.js'
const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth:adminAuthSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

export default store