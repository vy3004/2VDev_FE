import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Post } from "../../utils/types";

interface ReportModalState {
  repostModal: {
    repostModalOpen: boolean;
    post?: Post;
  };
}

const initialState: ReportModalState = {
  repostModal: {
    repostModalOpen: false,
  },
};

const repostModalSlice = createSlice({
  name: "RepostModal",
  initialState,
  reducers: {
    setRepostModal: (
      state,
      action: PayloadAction<ReportModalState["repostModal"]>
    ) => {
      state.repostModal = action.payload;
    },
  },
});

export const { setRepostModal } = repostModalSlice.actions;

export const selectRepostModal = (state: RootState) => state.repostModal;

export default repostModalSlice.reducer;
