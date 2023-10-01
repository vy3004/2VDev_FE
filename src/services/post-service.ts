import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";
import { PostType } from "../utils/constant";

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
}

interface GetNewsFeedPayLoad {
  post_type: PostType;
  limit: number;
  page: number;
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
  }: {
    post_id: string;
    limit: number;
    page: number;
  }) =>
    `${apiEndPoints.posts}/${post_id}/children/?limit=${limit}&page=${page}&post_type=2`,
  getNewsFeedNew: ({
    post_type,
    limit,
    page,
  }: {
    post_type: PostType;
    limit: number;
    page: number;
  }) =>
    `${apiEndPoints.posts}/newfeeds/new?limit=${limit}&page=${page}&post_type=${post_type}`,
  getNewsFeedFollow: ({
    post_type,
    limit,
    page,
  }: {
    post_type: PostType;
    limit: number;
    page: number;
  }) =>
    `${apiEndPoints.posts}/newfeeds/follow?limit=${limit}&page=${page}&post_type=${post_type}`,
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
  getNewsFeedNew: async ({
    post_type,
    limit,
    page,
  }: GetNewsFeedPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        postEndpoints.getNewsFeedNew({ post_type, limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getNewsFeedFollow: async ({
    post_type,
    limit,
    page,
  }: GetNewsFeedPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        postEndpoints.getNewsFeedFollow({ post_type, limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default postService;
