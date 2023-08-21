import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface GlobalLoadingState {
  isGlobalLoading: boolean;
}

const initialState: GlobalLoadingState = {
  isGlobalLoading: false,
};

const globalLoadingSlice = createSlice({
  name: "GlobalLoading",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isGlobalLoading = action.payload;
    },
  },
});

export const { setIsLoading } = globalLoadingSlice.actions;

export const selectGlobalLoading = (state: RootState) => state.globalLoading;

export default globalLoadingSlice.reducer;
