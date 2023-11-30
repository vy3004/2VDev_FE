import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ConfirmModalState {
  confirmModal: {
    confirmModalOpen: boolean;
    type: number;
    postId: string;
    role: number;
    isDeleted: boolean;
  };
}

const initialState: ConfirmModalState = {
  confirmModal: {
    confirmModalOpen: false,
    type: 0,
    postId: "",
    role: 0,
    isDeleted: false,
  },
};

const confirmModalSlice = createSlice({
  name: "confirmModal",
  initialState,
  reducers: {
    setConfirmModal: (
      state,
      action: PayloadAction<ConfirmModalState["confirmModal"]>
    ) => {
      state.confirmModal = action.payload;
    },
  },
});

export const { setConfirmModal } = confirmModalSlice.actions;

export const selectConfirmModal = (state: RootState) => state.confirmModal;

export default confirmModalSlice.reducer;
