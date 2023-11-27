import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "../configs/axios-config";
import { apiEndPoints } from "../utils/api-endpoints";

interface GetNotificationPayload {
  limit: number;
  page: number;
}

interface ReadNotificationPayload {
  notification_id: string;
}

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const notificationEndpoints = {
  getNotifications: ({ limit, page }: { limit: number; page: number }) =>
    `${apiEndPoints.notifications}?page=${page}&limit=${limit}`,
  getCountNotifications: `${apiEndPoints.notifications}/count`,
  readNotification: ({ notification_id }: { notification_id: string }) =>
    `${apiEndPoints.notifications}/${notification_id}`,
};

const notificationService = {
  getNotifications: async ({
    page,
    limit,
  }: GetNotificationPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        notificationEndpoints.getNotifications({ page, limit })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  getCountNotifications: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.get(
        notificationEndpoints.getCountNotifications
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
  readNotification: async ({
    notification_id,
  }: ReadNotificationPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(
        notificationEndpoints.readNotification({ notification_id })
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default notificationService;
