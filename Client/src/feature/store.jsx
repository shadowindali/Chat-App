import { configureStore } from "@reduxjs/toolkit";
import themeSliceRed from "./themeSlice";

export const store = configureStore({
    reducer: {
        themeKey : themeSliceRed,
    },
});

export default store;