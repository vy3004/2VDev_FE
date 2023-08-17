import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AuthModalState {
  authModalOpen: boolean;
  authModalName: string;
}

const initialState: AuthModalState = {
  authModalOpen: false,
  authModalName: "",
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },
    setAuthModalName: (state, action: PayloadAction<string>) => {
      state.authModalName = action.payload;
    },
  },
});

export const { setAuthModalOpen, setAuthModalName } = authModalSlice.actions;

export const selectAuthModal = (state: RootState) => state.authModal;

export default authModalSlice.reducer;
