import axiosInstance from "@/lib/axios";
import type {
  GetWorkspaceResponse,
  CreateWorkspaceRequest,
  WorkspaceResponse,
  UpdateWorkspaceRequest,
  WorkspaceMessageResponse,
} from "@/types/workspace.type";

export const createWorkspace = async (
  data: CreateWorkspaceRequest,
): Promise<WorkspaceResponse> => {
  const response = await axiosInstance.post<WorkspaceResponse>(
    `/workspace`,
    data,
  );
  return response.data;
};

export const getMyWorkspaces = async () => {
  const response = await axiosInstance.get<GetWorkspaceResponse>(`/workspace`);
  return response.data.workspace;
};

export const getWorkspaceBySlug = async (slug: string) => {
  const response = await axiosInstance.get<GetWorkspaceResponse>(
    `/workspace/${encodeURIComponent(slug)}`,
  );
  return response.data.workspace;
};

export const updateWorkspace = async (
  slug: string,
  data: UpdateWorkspaceRequest,
): Promise<WorkspaceResponse> => {
  const response = await axiosInstance.patch(
    `/workspace/${encodeURIComponent(slug)}`,
    data,
  );
  return response.data;
};

export const deleteWorkspace = async (
  slug: string,
): Promise<WorkspaceMessageResponse> => {
  const response = await axiosInstance.delete(
    `/workspace/${encodeURIComponent(slug)}`,
  );
  return response.data;
};
