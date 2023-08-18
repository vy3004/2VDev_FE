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

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const userEndpoints = {
  login: "/login",
  register: "/register",
  logout: "/logout",
  getMe: "/me",
  passwordUpdate: "/update-password",
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
  getInfo: async () => {
    try {
      const response = await axiosInstance.get(userEndpoints.getMe);

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default userService;
