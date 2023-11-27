import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface ReportPostPayload {
  post_id: string;
  reason: string;
}

interface GetReportsPayload {
  limit: number;
  page: number;
}

interface ReadReportPayload {
  post_id: string;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const reportPostEndpoints = {
  reportPost: `${apiEndPoints.reports}`,
  getReports: ({ limit, page }: { limit: number; page: number }) =>
    `${apiEndPoints.reports}?page=${page}&limit=${limit}`,
  readReport: ({ post_id }: { post_id: string }) =>
    `${apiEndPoints.reports}/${post_id}`,
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
  getReports: async ({
    limit,
    page,
  }: GetReportsPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        reportPostEndpoints.getReports({ limit, page })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  readReport: async ({
    post_id,
  }: ReadReportPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(
        reportPostEndpoints.readReport({ post_id })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default reportPostService;
