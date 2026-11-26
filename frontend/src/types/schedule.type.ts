export interface SchedulePostRequest {
  scheduledAt: string;
}

export interface SchedulePostResponse {
  message: string;
  postId: string;
  status: "SCHEDULED";
  scheduledAt: string;
}

export interface CancelScheduledPostResponse {
  message: string;
  postId: string;
  status: "CANCELLED";
}

export interface ReschedulePostResponse {
  message: string;
  postId: string;
  scheduledAt: string;
}
