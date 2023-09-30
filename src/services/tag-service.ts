import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const tagEndpoints = {
  getTags: `${apiEndPoints.hashtags}/get`,
};

const tagService = {
  getTags: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(tagEndpoints.getTags);

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default tagService;
