import type { Media } from "@/types/post.type";

export interface UploadPostMediaResponse {
  message: string;
  media: Media;
}

export interface GetPostMediaResponse {
  message: string;
  media: Media | null;
}

export interface DeletePostMediaResponse {
  message: string;
}
