import type {
  CreateInstagramContainerInput,
  InstagramApiResponse,
  InstagramRequestOptions,
  PublishInstagramContainerInput,
  PublishInstagramImageResult,
} from "../type/instagram.type.js";

const INSTAGRAM_GRAPH_URL = "https://graph.instagram.com";
const INSTAGRAM_API_VERSION = "v26.0";

const instagramRequest = async (
  endpoint: string,
  options: InstagramRequestOptions,
): Promise<InstagramApiResponse> => {
  const url = new URL(
    `${INSTAGRAM_GRAPH_URL}/${INSTAGRAM_API_VERSION}/${endpoint}`,
  );
  const requestOptions: RequestInit = {
    method: options.method,
    signal: AbortSignal.timeout(30_000),
  };
  if (requestOptions.method === "GET") {
    url.search = options.params.toString();
  } else {
    requestOptions.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    requestOptions.body = options.params;
  }
  const response = await fetch(url, requestOptions);
  const data = (await response.json()) as InstagramApiResponse;
  if (!response.ok || data.error) {
    throw new Error(
      data.error?.message ?? `Instagram API request failed: ${response.status}`,
    );
  }
  return data;
};
export const createInstagramContainer = async (
  data: CreateInstagramContainerInput,
): Promise<string> => {
  const params = new URLSearchParams({
    image_url: data.imageUrl,
    caption: data.caption,
    access_token: data.accessToken,
  });
  const result = await instagramRequest(`${data.instagramUserId}/media`, {
    method: "POST",
    params,
  });
  if (!result.id) {
    throw new Error("Instagram did not return a container ID");
  }
  return result.id;
};
export const getInstagramContainerStatus = async (
  containerId: string,
  accessToken: string,
): Promise<string> => {
  const params = new URLSearchParams({
    fields: "status_code",
    access_token: accessToken,
  });
  const result = await instagramRequest(containerId, {
    method: "GET",
    params,
  });
  if (!result.status_code) {
    throw new Error("Instagram did not return container status");
  }
  return result.status_code;
};
export const publishInstagramContainer = async (
  data: PublishInstagramContainerInput,
): Promise<PublishInstagramImageResult> => {
  const params = new URLSearchParams({
    creation_id: data.containerId,
    access_token: data.accessToken,
  });
  const result = await instagramRequest(
    `${data.instagramUserId}/media_publish`,
    {
      method: "POST",
      params,
    },
  );

  if (!result.id) {
    throw new Error("Instagram did not return a published media ID");
  }
  return {
    containerId: data.containerId,
    instagramMediaId: result.id,
  };
};
