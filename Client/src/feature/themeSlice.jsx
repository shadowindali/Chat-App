import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: "themeSlice",
    initialState: true,
    reducers: {
        toggleTheme: (state) => {
            // Modify the state directly to toggle the theme
            return !state;
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
