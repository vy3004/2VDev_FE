import queryString from "query-string";
import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";

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

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const userEndpoints = {
  login: "/login",
  register: "/register",
  logout: "/logout",
  refreshToken: "/refresh-token",
  getMe: "/me",
  verifyEmail: "/verify-email",
  resendVerifyEmail: "/resend-verify-email",
  forgotPassword: "/forgot-password",
  verifyForgotPassword: "/verify-forgot-password",
  resetPassword: "/reset-password",
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
};

export default userService;
