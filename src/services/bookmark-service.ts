import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";

interface bookmarkPostPayload {
  post_id: string;
}

interface unmarkPostPayload {
  post_id: string;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const bookmarkEndpoints = {
  bookmarkPost: "/bookmarks",
  unmarkPost: ({ post_id }: { post_id: string }) =>
    `/bookmarks/posts/${post_id}`,
};

const bookmarkService = {
  bookmarkPost: async ({
    post_id,
  }: bookmarkPostPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(
        bookmarkEndpoints.bookmarkPost,
        {
          post_id,
        }
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },

  unmarkPost: async ({
    post_id,
  }: unmarkPostPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(
        bookmarkEndpoints.unmarkPost({ post_id })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default bookmarkService;
