import { configureStore } from '@reduxjs/toolkit';
import customerHomeReducer from './customerHomeSlice';

export const store = configureStore({
    reducer: {
        customerHome: customerHomeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
