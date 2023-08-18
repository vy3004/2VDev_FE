import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UserState {
  user: {
    _id?: string;
    name: string;
    email: string;
    date_of_birth?: Date;
    password: string;
    email_verify_token?: string;
    forgot_password_token?: string;
    verify?: number;
    role?: number;
    level?: number;
    point?: number;
    bio?: string;
    location?: string;
    website?: string;
    username?: string;
    avatar?: string;
    cover_photo?: string;
  } | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
