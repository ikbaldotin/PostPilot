import type {
  InstagramApiResponse,
  PublishInstagramImageInput,
  PublishInstagramImageResult,
} from "../type/instagram.type.js";

const INSTAGRAM_GRAPH_URL = "https://graph.instagram.com";
const INSTAGRAM_API_VERSION = "v26.0";

const instagramRequest = async (
  endPoint: string,
  params: URLSearchParams,
): Promise<InstagramApiResponse> => {
  const response = await fetch(
    `${INSTAGRAM_GRAPH_URL}/${INSTAGRAM_API_VERSION}/${endPoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      signal: AbortSignal.timeout(300000),
    },
  );
  const data = (await response.json()) as InstagramApiResponse;
  if (!response.ok || data.error) {
    throw new Error(
      data.error?.message ?? `Instagram API request failed: ${response.status}`,
    );
  }
  return data;
};

export const publishInstagramImage = async (
  data: PublishInstagramImageInput,
): Promise<PublishInstagramImageResult> => {
  const { instagramUserId, accessToken, imageUrl, caption } = data;
  const containerParams = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  });
  const container = await instagramRequest(
    `${instagramUserId}/media`,
    containerParams,
  );
  if (!container.id) {
    throw new Error("Instagram did not return a media container ID");
  }
  const containerId = container.id;
  const publishParams = new URLSearchParams({
    creation_id: containerId,
    access_token: accessToken,
  });
  const published = await instagramRequest(
    `${instagramUserId}/media_publish`,
    publishParams,
  );
  if (!published.id) {
    throw new Error("Instagram did not return a published media ID");
  }
  return {
    containerId,
    instagramMediaId: published.id,
  };
};
