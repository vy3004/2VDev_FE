import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const tagEndpoints = {
  getTags: "/hashtags/get",
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
