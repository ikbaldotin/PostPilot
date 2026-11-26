export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export interface MemberUser {
  id: string;
  name: string;
  email: string;
}

export interface Membership {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember extends Membership {
  user: MemberUser;
}

export interface ViewMembersResponse {
  members: WorkspaceMember[];
}

export interface AddMemberResponse {
  message: string;
  membership: Membership;
}

export interface MembershipMessageResponse {
  message: string;
}

export interface UpdateMemberRequest {
  role: Exclude<WorkspaceRole, "OWNER">;
}
