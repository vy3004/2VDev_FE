import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface SearchPostPayload {
  content: string;
  limit: number;
  page: number;
}

interface SearchUserPayload {
  content: string;
  limit: number;
  page: number;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const searchEndpoints = {
  searchPost: ({
    content,
    limit,
    page,
  }: {
    content: string;
    limit: number;
    page: number;
  }) =>
    `${apiEndPoints.search}/post?content=${content}&limit=${limit}&page=${page}`,
  searchUser: ({
    content,
    limit,
    page,
  }: {
    content: string;
    limit: number;
    page: number;
  }) =>
    `${apiEndPoints.search}/user?content=${content}&limit=${limit}&page=${page}`,
};

const searchService = {
  searchPost: async ({
    content,
    limit,
    page,
  }: SearchPostPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        searchEndpoints.searchPost({ content, limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },

  searchUser: async ({
    content,
    limit,
    page,
  }: SearchUserPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        searchEndpoints.searchUser({ content, limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default searchService;
