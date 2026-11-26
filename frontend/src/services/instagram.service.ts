import axiosInstance from "@/lib/axios";
import type {
  InstagramDisconnectResponse,
  InstagramStatusResponse,
} from "@/types/instagram.type";

export const getInstagramStatus =
  async (): Promise<InstagramStatusResponse> => {
    const response =
      await axiosInstance.get<InstagramStatusResponse>(`/instagram/status`);
    return response.data;
  };

export const disconnectInstagram =
  async (): Promise<InstagramDisconnectResponse> => {
    const response = await axiosInstance.delete(
      `/instagram/disconnectInstagram`,
    );
    return response.data;
  };

export const connectInstagram = (): void => {
  window.location.assign(`${axiosInstance.defaults.baseURL}/instagram/connect`);
};
