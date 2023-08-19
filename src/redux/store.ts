import thunkMiddleware from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

import authModalSlice from "./features/auth-modal-slice";
import userSlice from "./features/user-slice";
import appStateSlice from "./features/app-state-slice";

const store = configureStore({
  reducer: {
    authModal: authModalSlice,
    user: userSlice,
    appState: appStateSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
