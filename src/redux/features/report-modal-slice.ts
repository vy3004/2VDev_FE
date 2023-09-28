import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ReportModalState {
  reportModal: {
    reportModalOpen: boolean;
    post_id: string;
    reason: string;
  };
}

const initialState: ReportModalState = {
  reportModal: {
    reportModalOpen: false,
    post_id: "",
    reason: "",
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
