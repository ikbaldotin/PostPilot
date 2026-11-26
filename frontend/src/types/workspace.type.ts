export interface Workspace {
  id: string;
  name: string;
  slug: string;
}

export interface CreateWorkspaceRequest {
  name: string;
}

export interface UpdateWorkspaceRequest {
  name: string;
}

export interface WorkspaceMessageResponse {
  message: string;
}

export interface WorkspaceResponse extends WorkspaceMessageResponse {
  workspace: Workspace;
}

export interface GetMyWorkspacesResponse {
  workspaces: Workspace[];
}

export interface GetWorkspaceResponse {
  workspace: Workspace;
}
