import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Post } from "../../utils/types";

interface PostInfoModalState {
  postInfoModal: {
    postInfoModalOpen: boolean;
    post?: Post;
    reason?: string;
  };
}

const initialState: PostInfoModalState = {
  postInfoModal: {
    postInfoModalOpen: false,
  },
};

const postInfoModalSlice = createSlice({
  name: "PostInfoModal",
  initialState,
  reducers: {
    setPostInfoModal: (
      state,
      action: PayloadAction<PostInfoModalState["postInfoModal"]>
    ) => {
      state.postInfoModal = action.payload;
    },
  },
});

export const { setPostInfoModal } = postInfoModalSlice.actions;

export const selectPostInfoModal = (state: RootState) => state.postInfoModal;

export default postInfoModalSlice.reducer;
