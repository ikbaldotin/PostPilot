interface InstagramApiError {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
}
export interface InstagramApiResponse {
  id?: string;
  error?: InstagramApiError;
  status_code?: string;
}

export interface PublishInstagramContainerInput {
  instagramUserId: string;
  containerId: string;
  accessToken: string;
}
export interface PublishInstagramImageResult {
  containerId: string;
  instagramMediaId: string;
}
export interface InstagramRequestOptions {
  method: "GET" | "POST";
  params: URLSearchParams;
}
export interface CreateInstagramContainerInput {
  instagramUserId: string;
  accessToken: string;
  imageUrl: string;
  caption: string;
}
