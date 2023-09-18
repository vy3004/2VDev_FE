import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";

interface PostQuestionPayLoad {
  user_id: string;
  title: string;
  content: string;
  hashtags: string[];
  medias?: string[];
  parent_id: string | null;
  type: number;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const postEndpoints = {
  postQuestion: "/posts",
};

const postService = {
  postQuestion: async ({
    user_id,
    title,
    content,
    hashtags,
    medias,
    parent_id,
    type,
  }: PostQuestionPayLoad): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(postEndpoints.postQuestion, {
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
};

export default postService;
