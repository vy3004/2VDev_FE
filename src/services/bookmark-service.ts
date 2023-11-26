import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface GetMyBookmarksPayload {
  limit: number;
  page: number;
}

interface BookmarkPostPayload {
  post_id: string;
}

interface UnmarkPostPayload {
  post_id: string;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const bookmarkEndpoints = {
  getMyBookmarks: ({ limit, page }: { limit: number; page: number }) =>
    `${apiEndPoints.bookmarks}?page=${page}&limit=${limit}`,
  bookmarkPost: `${apiEndPoints.bookmarks}`,
  unmarkPost: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.bookmarks}/posts/${post_id}`,
};

const bookmarkService = {
  getMyBookmarks: async ({
    page,
    limit,
  }: GetMyBookmarksPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        bookmarkEndpoints.getMyBookmarks({ page, limit })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },

  bookmarkPost: async ({
    post_id,
  }: BookmarkPostPayload): Promise<ApiResponse<any>> => {
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
  }: UnmarkPostPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.delete(
        bookmarkEndpoints.unmarkPost({ post_id })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default bookmarkService;
