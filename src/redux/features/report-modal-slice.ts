import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ReportModalState {
  reportModal: {
    reportModalOpen: boolean;
    postId: string;
    otherUserId: string;
    isReported: boolean;
  };
}

const initialState: ReportModalState = {
  reportModal: {
    reportModalOpen: false,
    postId: "",
    otherUserId: "",
    isReported: false,
  },
};

const reportModalSlice = createSlice({
  name: "ReportModal",
  initialState,
  reducers: {
    setReportModal: (
      state,
      action: PayloadAction<ReportModalState["reportModal"]>
    ) => {
      state.reportModal = action.payload;
    },
  },
});

export const { setReportModal } = reportModalSlice.actions;

export const selectReportModal = (state: RootState) => state.reportModal;

export default reportModalSlice.reducer;
