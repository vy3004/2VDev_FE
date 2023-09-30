import { AxiosResponse, AxiosError } from "axios";
import axiosFile from "../configs/axios-config-file";
import { apiEndPoints } from "../utils/api-endpoints";

interface ApiResponse<T> {
  response?: AxiosResponse<T>;
  error?: AxiosError;
}

const mediaEndpoints = {
  uploadImage: `${apiEndPoints.medias}/upload-image`,
};

const mediaService = {
  uploadImage: async (file: any): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosFile.post(
        mediaEndpoints.uploadImage,
        formData
      );

      return { response };
    } catch (error) {
      return { error: error as AxiosError };
    }
  },
};

export default mediaService;
