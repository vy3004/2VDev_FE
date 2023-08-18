import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import queryString from "query-string";

const baseURL = "http://localhost:5000";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const axiosInstance = axios.create({
  baseURL,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosInstance.interceptors.request.use(
  async (
    config: AxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig<any> | CustomAxiosRequestConfig> => {
    return {
      ...config,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      } as AxiosRequestHeaders,
    };
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    throw error.response?.data;
  }
);

export default axiosInstance;
