import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AuthModalState {
  authModalOpen: boolean;
  authModalName: string;
  notification: string;
}

const initialState: AuthModalState = {
  authModalOpen: false,
  authModalName: "",
  notification: "",
};

const authModalSlice = createSlice({
  name: "AuthModal",
  initialState,
  reducers: {
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },
    setAuthModalName: (state, action: PayloadAction<string>) => {
      state.authModalName = action.payload;
    },
    setNotification: (state, action: PayloadAction<string>) => {
      state.notification = action.payload;
    },
  },
});

export const { setAuthModalOpen, setAuthModalName, setNotification } =
  authModalSlice.actions;

export const selectAuthModal = (state: RootState) => state.authModal;

export default authModalSlice.reducer;
