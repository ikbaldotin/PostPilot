export type PostStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "FAILED"
  | "CANCELLED";

export interface Media {
  id: string;
  url: string;
  publicId: string;
  originalName: string;
  mimetype: string;
  format: string;
  size: number;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  userId: string;
  workspaceId: string;
  content: string;
  status: PostStatus;
  instagramContainerId: string | null;
  instagramMediaId: string | null;
  scheduledAt: string | null;
  publishedAt: string | null;
  scheduleVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithMedia extends Post {
  media: Media | null;
}

export interface CreatePostRequest {
  content: string;
  workspaceId: string;
}

export interface UpdatePostRequest {
  content: string;
}

export interface DeletePostResponse {
  message: string;
}
