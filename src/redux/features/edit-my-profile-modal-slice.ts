import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface EditMyProfileModalState {
  editMyProfileModalOpen: boolean;
}

const initialState: EditMyProfileModalState = {
  editMyProfileModalOpen: false,
};

const editMyProfileModalSlice = createSlice({
  name: "EditMyProfileModal",
  initialState,
  reducers: {
    setEditMyProfileModalOpen: (state, action: PayloadAction<boolean>) => {
      state.editMyProfileModalOpen = action.payload;
    },
  },
});

export const { setEditMyProfileModalOpen } = editMyProfileModalSlice.actions;

export const selectEditMyProfileModal = (state: RootState) =>
  state.editMyProfileModal;

export default editMyProfileModalSlice.reducer;
