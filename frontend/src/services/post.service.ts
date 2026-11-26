import axiosInstance from "@/lib/axios";
import type {
  Post,
  CreatePostRequest,
  PostWithMedia,
  UpdatePostRequest,
  DeletePostResponse,
} from "@/types/post.type";

export const createPost = async (data: CreatePostRequest) => {
  const response = await axiosInstance.post<Post>(`/post`, data);
  return response.data;
};

export const getAllPosts = async (
  workspaceId: string,
): Promise<PostWithMedia> => {
  const response = await axiosInstance.get<PostWithMedia>(
    `/post/workspaces/${encodeURIComponent(workspaceId)}/posts`,
  );
  return response.data;
};

export const getSinglePost = async (
  workspaceId: string,
  postId: string,
): Promise<PostWithMedia> => {
  const response = await axiosInstance.get<PostWithMedia>(
    `/post/workspaces/${encodeURIComponent(workspaceId)}/posts/${encodeURIComponent(postId)}`,
  );
  return response.data;
};

export const updatePost = async (
  workspaceId: string,
  postId: string,
  data: UpdatePostRequest,
): Promise<Post> => {
  const response = await axiosInstance.patch<Post>(
    `/post/${encodeURIComponent(workspaceId)}/posts/${encodeURIComponent(postId)}`,
    data,
  );
  return response.data;
};

export const deletePost = async (
  workspaceId: string,
  postId: string,
): Promise<DeletePostResponse> => {
  const response = await axiosInstance.delete<DeletePostResponse>(
    `/post/workspaces/${encodeURIComponent(workspaceId)}/posts/${encodeURIComponent(postId)}`,
  );
  return response.data;
};
