interface InstagramApiError {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
}
export interface InstagramApiResponse {
  id?: string;
  error?: InstagramApiError;
}

export interface PublishInstagramImageInput {
  instagramUserId: string;
  accessToken: string;
  imageUrl: string;
  caption: string;
}
export interface PublishInstagramImageResult {
  containerId: string;
  instagramMediaId: string;
}
