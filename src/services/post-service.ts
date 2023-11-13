import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";
import { PostType } from "../utils/constant";

interface PostPayLoad {
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

interface GetPostsByHashtagPayLoad {
  hashtag_id: string;
  limit: number;
  page: number;
  sort_field: string;
  sort_value: number;
}

interface GetPostsByUserPayLoad {
  user_id: string;
  limit: number;
  page: number;
  type: PostType;
}

interface EditPostPayLoad {
  post_id: string;
  title?: string | null;
  content: string;
  hashtags?: string[];
  medias?: string[];
}

interface PinCommentPayLoad {
  post_id: string;
  resolved_id: string | null;
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
  postOpenAI: `${apiEndPoints.posts}/gpt`,
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
  getPostsByHashtag: ({
    hashtag_id,
    limit,
    page,
    sort_field,
    sort_value,
  }: {
    hashtag_id: string;
    limit: number;
    page: number;
    sort_field: string;
    sort_value: number;
  }) =>
    `${apiEndPoints.posts}/hashtags/${hashtag_id}?limit=${limit}&page=${page}&sort_field=${sort_field}&sort_value=${sort_value}`,
  getPostsByUser: ({
    user_id,
    limit,
    page,
    type,
  }: {
    user_id: string;
    limit: number;
    page: number;
    type: PostType;
  }) =>
    `${apiEndPoints.posts}/userposts/${user_id}?limit=${limit}&page=${page}&type=${type}`,

  editPost: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.posts}/${post_id}`,
  pinComment: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.posts}/resolve/${post_id}`,
  deletePost: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.posts}/${post_id}`,
};

const postService = {
  post: async ({
    title,
    content,
    hashtags,
    medias,
    parent_id,
    type,
  }: PostPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(postEndpoints.post, {
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
  postOpenAI: async ({
    title,
    content,
    hashtags,
    medias,
    parent_id,
    type,
  }: PostPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(postEndpoints.postOpenAI, {
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
  getPostsByHashtag: async ({
    hashtag_id,
    limit,
    page,
    sort_field,
    sort_value,
  }: GetPostsByHashtagPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        postEndpoints.getPostsByHashtag({
          hashtag_id,
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
  getPostsByUser: async ({
    user_id,
    limit,
    page,
    type,
  }: GetPostsByUserPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        postEndpoints.getPostsByUser({
          user_id,
          limit,
          page,
          type,
        })
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
  pinComment: async ({
    post_id,
    resolved_id,
  }: PinCommentPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.patch(
        postEndpoints.pinComment({ post_id }),
        { resolved_id }
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
