import queryString from "query-string";
import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  password: string;
  confirm_password: string;
}

interface GetUsersPayload {
  limit: number;
  page: number;
}

interface GetUserPayload {
  username: string;
}

interface UpdateMePayLoad {
  name?: string;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}

interface UpdateUserPayLoad {
  user_id: string;
  username: string;
  name?: string;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  cover_photo?: string;
  role?: number;
  verify?: number;
  level?: number;
}

interface FollowPayLoad {
  followed_user_id: string;
}

interface UnfollowPayLoad {
  user_id: string;
}

interface GetFollowersPayLoad {
  user_id: string;
  limit: number;
  page: number;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const userEndpoints = {
  login: `${apiEndPoints.users}/login`,
  register: `${apiEndPoints.users}/register`,
  logout: `${apiEndPoints.users}/logout`,
  refreshToken: `${apiEndPoints.users}/refresh-token`,
  verifyEmail: `${apiEndPoints.users}/verify-email`,
  resendVerifyEmail: `${apiEndPoints.users}/resend-verify-email`,
  forgotPassword: `${apiEndPoints.users}/forgot-password`,
  verifyForgotPassword: `${apiEndPoints.users}/verify-forgot-password`,
  resetPassword: `${apiEndPoints.users}/reset-password`,

  getMe: `${apiEndPoints.users}/me`,
  updateMe: `${apiEndPoints.users}/me`,
  getUsers: ({ limit, page }: { limit: number; page: number }) =>
    `${apiEndPoints.users}/list-users?limit=${limit}&page=${page}`,
  getUser: ({ username }: { username: string }) =>
    `${apiEndPoints.users}/${username}`,
  getFollowing: ({
    user_id,
    limit,
    page,
  }: {
    user_id: string;
    limit: number;
    page: number;
  }) =>
    `${apiEndPoints.users}/followers/list-users-following/${user_id}?limit=${limit}&page=${page}`,
  getFollower: ({
    user_id,
    limit,
    page,
  }: {
    user_id: string;
    limit: number;
    page: number;
  }) =>
    `${apiEndPoints.users}/followers/list-users-follower/${user_id}?limit=${limit}&page=${page}`,
  follow: `${apiEndPoints.users}/follow`,
  unfollow: ({ user_id }: { user_id: string }) =>
    `${apiEndPoints.users}/follow/${user_id}`,
  // Role admin
  updateUser: ({ user_id }: { user_id: string }) =>
    `${apiEndPoints.users}/update-account/${user_id}`,
};

const userService = {
  login: async ({
    email,
    password,
  }: LoginPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(userEndpoints.login, {
        email,
        password,
      });
      localStorage.setItem("access_token", response.data.result.access_token);
      localStorage.setItem("refresh_token", response.data.result.refresh_token);

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  register: async ({
    email,
    password,
    confirm_password,
    name,
  }: RegisterPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(userEndpoints.register, {
        email,
        password,
        confirm_password,
        name,
      });
      localStorage.setItem("access_token", response.data.result.access_token);
      localStorage.setItem("refresh_token", response.data.result.refresh_token);

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  logout: async (): Promise<ApiResponse<any>> => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");

      const response = await axiosInstance.post(userEndpoints.logout, {
        refresh_token,
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  refreshToken: async (): Promise<ApiResponse<any>> => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");

      const response = await axiosInstance.post(userEndpoints.refreshToken, {
        refresh_token,
      });
      localStorage.setItem("access_token", response.data.result.access_token);
      localStorage.setItem("refresh_token", response.data.result.refresh_token);

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getInfo: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(userEndpoints.getMe);

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  updateMe: async ({
    name,
    date_of_birth,
    bio,
    location,
    website,
    username,
    avatar,
    cover_photo,
  }: UpdateMePayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.patch(userEndpoints.updateMe, {
        name,
        date_of_birth,
        bio,
        location,
        website,
        username,
        avatar,
        cover_photo,
      });

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  verifyEmail: async (): Promise<ApiResponse<any>> => {
    try {
      const value = queryString.parse(window.location.search);
      const email_verify_token = value.token;

      const response = await axiosInstance.post(userEndpoints.verifyEmail, {
        email_verify_token,
      });

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  resendVerifyEmail: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(
        userEndpoints.resendVerifyEmail
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  forgotPassword: async ({
    email,
  }: ForgotPasswordPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(userEndpoints.forgotPassword, {
        email,
      });

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  verifyForgotPassword: async (): Promise<ApiResponse<any>> => {
    try {
      const value = queryString.parse(window.location.search);
      const forgot_password_token = value.token;

      const response = await axiosInstance.post(
        userEndpoints.verifyForgotPassword,
        {
          forgot_password_token,
        }
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  resetPassword: async ({
    password,
    confirm_password,
  }: ResetPasswordPayload): Promise<ApiResponse<any>> => {
    try {
      const value = queryString.parse(window.location.search);
      const forgot_password_token = value.token;

      const response = await axiosInstance.post(userEndpoints.resetPassword, {
        forgot_password_token,
        password,
        confirm_password,
      });

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },

  getUsers: async ({
    limit,
    page,
  }: GetUsersPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        userEndpoints.getUsers({ limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getFollowing: async ({
    user_id,
    limit,
    page,
  }: GetFollowersPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        userEndpoints.getFollowing({ user_id, limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getFollower: async ({
    user_id,
    limit,
    page,
  }: GetFollowersPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        userEndpoints.getFollower({ user_id, limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getUser: async ({ username }: GetUserPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        userEndpoints.getUser({ username })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  follow: async ({
    followed_user_id,
  }: FollowPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(userEndpoints.follow, {
        followed_user_id,
      });

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  unfollow: async ({ user_id }: UnfollowPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.delete(
        userEndpoints.unfollow({ user_id })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },

  // Role admin
  updateUser: async ({
    user_id,
    name,
    date_of_birth,
    bio,
    location,
    website,
    username,
    avatar,
    cover_photo,
    role,
    verify,
    level,
  }: UpdateUserPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.patch(
        userEndpoints.updateUser({ user_id }),
        {
          name,
          date_of_birth,
          bio,
          location,
          website,
          username,
          avatar,
          cover_photo,
          role,
          verify,
          level,
        }
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default userService;
