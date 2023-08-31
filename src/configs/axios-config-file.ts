import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import queryString from "query-string";

const baseURL = process.env.REACT_APP_BACKEND_URL;

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const axiosFile = axios.create({
  baseURL,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosFile.interceptors.request.use(
  async (
    config: AxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig<any> | CustomAxiosRequestConfig> => {
    return {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      } as AxiosRequestHeaders,
    };
  }
);

axiosFile.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    throw error.response?.data;
  }
);

export default axiosFile;
