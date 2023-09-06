import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AppState {
  appState: string;
  isSearch: boolean;
  themeMode: boolean;
}

const initialState: AppState = {
  appState: "",
  isSearch: false,
  themeMode:
    localStorage.getItem("themeMode") === "dark" ? true : false || false,
};

const appStateSlice = createSlice({
  name: "AppState",
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<string>) => {
      state.appState = action.payload;
    },
    setIsSearch: (state, action: PayloadAction<boolean>) => {
      state.isSearch = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<boolean>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { setAppState, setIsSearch, setThemeMode } = appStateSlice.actions;

export const selectApp = (state: RootState) => state.appState;

export default appStateSlice.reducer;
