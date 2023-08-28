import { createSlice } from '@reduxjs/toolkit';

export const customerHomeSlice = createSlice({
    name: 'customerHome',
    initialState: {
        veganMode: true
    },
    reducers: {
        toggleVeganMode: (state) => {
            state.veganMode = !state.veganMode;
        },
    },
});

export const { toggleVeganMode } = customerHomeSlice.actions;

export default customerHomeSlice.reducer;
