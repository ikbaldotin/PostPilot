import axiosInstance from "@/lib/axios";
import type {
  SchedulePostRequest,
  SchedulePostResponse,
  CancelScheduledPostResponse,
  ReschedulePostResponse,
} from "@/types/schedule.type";

const SCHEDULE_ENDPOINT = "/schedule/workspaces";

export const schedulePost = async (
  workspaceId: string,
  postId: string,
  data: SchedulePostRequest,
): Promise<SchedulePostResponse> => {
  const response = await axiosInstance.post<SchedulePostResponse>(
    `${SCHEDULE_ENDPOINT}/${encodeURIComponent(workspaceId)}/posts/${encodeURIComponent(postId)}/schedule`,
    data,
  );

  return response.data;
};

export const cancelScheduledPost = async (
  workspaceId: string,
  postId: string,
): Promise<CancelScheduledPostResponse> => {
  const response = await axiosInstance.patch<CancelScheduledPostResponse>(
    `${SCHEDULE_ENDPOINT}/${encodeURIComponent(workspaceId)}/posts/${encodeURIComponent(postId)}/cancel`,
  );

  return response.data;
};

export const reschedulePost = async (
  workspaceId: string,
  postId: string,
  data: SchedulePostRequest,
): Promise<ReschedulePostResponse> => {
  const response = await axiosInstance.patch<ReschedulePostResponse>(
    `${SCHEDULE_ENDPOINT}/${encodeURIComponent(workspaceId)}/posts/${encodeURIComponent(postId)}/reschedule`,
    data,
  );

  return response.data;
};
