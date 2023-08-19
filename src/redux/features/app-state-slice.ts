import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AppState {
  appState: string;
}

const initialState: AppState = {
  appState: "",
};

const appStateSlice = createSlice({
  name: "AppState",
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<string>) => {
      state.appState = action.payload;
    },
  },
});

export const { setAppState } = appStateSlice.actions;

export const selectApp = (state: RootState) => state.appState;

export default appStateSlice.reducer;
