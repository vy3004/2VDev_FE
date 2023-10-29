import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface PostPayLoad {
  user_id: string;
  title: string | null;
  content: string;
  hashtags?: string[];
  medias?: string[];
  parent_id: string | null;
  type: number;
}

interface GetPostPayLoad {
  post_id: string;
}

interface GetCommentsPayLoad {
  post_id: string;
  limit: number;
  page: number;
  sort_field: string;
  sort_value: number;
}

interface GetNewsFeedPayLoad {
  type: string;
  limit: number;
  page: number;
  sort_field: string;
  sort_value: number;
}

interface EditPostPayLoad {
  post_id: string;
  title?: string | null;
  content: string;
  hashtags?: string[];
  medias?: string[];
}

interface DeletePostPayLoad {
  post_id: string;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const postEndpoints = {
  post: `${apiEndPoints.posts}`,
  getPost: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.posts}/${post_id}`,
  getComments: ({
    post_id,
    limit,
    page,
    sort_field,
    sort_value,
  }: {
    post_id: string;
    limit: number;
    page: number;
    sort_field: string;
    sort_value: number;
  }) =>
    `${apiEndPoints.posts}/${post_id}/children/?limit=${limit}&page=${page}&post_type=2&sort_field=${sort_field}&sort_value=${sort_value}`,
  getNewsFeed: ({
    type,
    limit,
    page,
    sort_field,
    sort_value,
  }: {
    type: string;
    limit: number;
    page: number;
    sort_field: string;
    sort_value: number;
  }) =>
    `${apiEndPoints.posts}/newfeeds?limit=${limit}&page=${page}&type=${type}&sort_field=${sort_field}&sort_value=${sort_value}`,
  editPost: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.posts}/${post_id}`,
  deletePost: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.posts}/${post_id}`,
};

const postService = {
  post: async ({
    user_id,
    title,
    content,
    hashtags,
    medias,
    parent_id,
    type,
  }: PostPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(postEndpoints.post, {
        user_id,
        title,
        content,
        hashtags,
        medias,
        parent_id,
        type,
      });

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getPost: async ({ post_id }: GetPostPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        postEndpoints.getPost({ post_id })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getComments: async ({
    post_id,
    limit,
    page,
    sort_field,
    sort_value,
  }: GetCommentsPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        postEndpoints.getComments({
          post_id,
          limit,
          page,
          sort_field,
          sort_value,
        })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getNewsFeed: async ({
    type,
    limit,
    page,
    sort_field,
    sort_value,
  }: GetNewsFeedPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        postEndpoints.getNewsFeed({ type, limit, page, sort_field, sort_value })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  editPost: async ({
    post_id,
    title,
    content,
    hashtags,
    medias,
  }: EditPostPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.patch(
        postEndpoints.editPost({ post_id }),
        {
          title,
          content,
          hashtags,
          medias,
        }
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  deletePost: async ({
    post_id,
  }: DeletePostPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.delete(
        postEndpoints.deletePost({ post_id })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default postService;
