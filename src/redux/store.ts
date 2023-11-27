import thunkMiddleware from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

import authModalSlice from "./features/auth-modal-slice";
import userSlice from "./features/user-slice";
import appStateSlice from "./features/app-state-slice";
import globalLoading from "./features/global-loading";
import editMyProfileModalSlice from "./features/edit-my-profile-modal-slice";
import postInfoModalSlice from "./features/post-info-slice";
import reportModalSlice from "./features/report-modal-slice";
import repostModalSlice from "./features/repost-modal-slice";
import confirmModalSlice from "./features/confirm-modal-slice";

const store = configureStore({
  reducer: {
    authModal: authModalSlice,
    editMyProfileModal: editMyProfileModalSlice,
    postInfoModal: postInfoModalSlice,
    reportModal: reportModalSlice,
    repostModal: repostModalSlice,
    confirmModal: confirmModalSlice,
    user: userSlice,
    appState: appStateSlice,
    globalLoading: globalLoading,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
