import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";

interface PostPayLoad {
  user_id: string;
  title: string;
  content: string;
  hashtags: string[];
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
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const postEndpoints = {
  post: "/posts",
  getPost: ({ post_id }: { post_id: string }) => `/posts/${post_id}`,
  getComments: ({
    post_id,
    limit,
    page,
  }: {
    post_id: string;
    limit: number;
    page: number;
  }) => `/posts/${post_id}/children/?limit=${limit}&page=${page}&post_type=2`,
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
  }: GetCommentsPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        postEndpoints.getComments({ post_id, limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default postService;
