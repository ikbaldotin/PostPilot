import axiosInstance from "@/lib/axios";
import type {
  DeletePostMediaResponse,
  GetPostMediaResponse,
  UploadPostMediaResponse,
} from "@/types/media.type";

export const uploadPostMedia = async (
  workspaceId: string,
  postId: string,
  file: File,
): Promise<UploadPostMediaResponse> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axiosInstance.post<UploadPostMediaResponse>(
    `/media/${encodeURIComponent(workspaceId)}/${encodeURIComponent(postId)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
export const getPostMedia = async (
  workspaceId: string,
  postId: string,
): Promise<GetPostMediaResponse> => {
  const response = await axiosInstance.get<GetPostMediaResponse>(
    `/media/${encodeURIComponent(workspaceId)}/${encodeURIComponent(postId)}`,
  );
  return response.data;
};

export const deletePostMedia = async (
  workspaceId: string,
  postId: string,
): Promise<DeletePostMediaResponse> => {
  const response = await axiosInstance.delete<DeletePostMediaResponse>(
    `/media/${encodeURIComponent(workspaceId)}/${encodeURIComponent(postId)}`,
  );
  return response.data;
};
