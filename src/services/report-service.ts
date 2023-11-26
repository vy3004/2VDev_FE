import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface ReportPostPayload {
  post_id: string;
  reason: string;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const reportPostEndpoints = {
  reportPost: `${apiEndPoints.reports}`,
  getReports: `${apiEndPoints.reports}`,
};

const reportPostService = {
  reportPost: async ({
    post_id,
    reason,
  }: ReportPostPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(
        reportPostEndpoints.reportPost,
        {
          post_id,
          reason,
        }
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getReports: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(reportPostEndpoints.getReports);

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default reportPostService;
