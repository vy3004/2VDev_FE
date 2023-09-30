import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface VotePostPayload {
  post_id: string;
}

interface RemoveVotePostPayload {
  post_id: string;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const voteEndpoints = {
  votePost: `${apiEndPoints.votes}`,
  removeVotePost: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.votes}/posts/${post_id}`,
};

const voteService = {
  votePost: async ({ post_id }: VotePostPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(voteEndpoints.votePost, {
        post_id,
      });

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },

  removeVotePost: async ({
    post_id,
  }: RemoveVotePostPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.delete(
        voteEndpoints.removeVotePost({ post_id })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default voteService;
