import axiosInstance from "@/lib/axios";
import type {
  AddMemberResponse,
  MembershipMessageResponse,
  UpdateMemberRequest,
  ViewMembersResponse,
} from "@/types/membership.type";

export const viewMembers = async (
  slug: string,
): Promise<ViewMembersResponse> => {
  const response = await axiosInstance.get<ViewMembersResponse>(
    `/membership/${encodeURIComponent(slug)}/members`,
  );

  return response.data;
};

export const addMember = async (
  workspaceId: string,
  userId: string,
): Promise<AddMemberResponse> => {
  const response = await axiosInstance.post<AddMemberResponse>(
    `/membership/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}`,
  );

  return response.data;
};

export const updateMember = async (
  workspaceId: string,
  userId: string,
  data: UpdateMemberRequest,
): Promise<MembershipMessageResponse> => {
  const response = await axiosInstance.patch<MembershipMessageResponse>(
    `/membership/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}`,
    data,
  );

  return response.data;
};

export const removeMember = async (
  workspaceId: string,
  userId: string,
): Promise<MembershipMessageResponse> => {
  const response = await axiosInstance.delete<MembershipMessageResponse>(
    `/membership/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}`,
  );

  return response.data;
};

export const leaveWorkspace = async (
  workspaceId: string,
): Promise<MembershipMessageResponse> => {
  const response = await axiosInstance.delete<MembershipMessageResponse>(
    `/membership/${encodeURIComponent(workspaceId)}/leave`,
  );

  return response.data;
};
