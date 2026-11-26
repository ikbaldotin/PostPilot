import axiosInstance from "@/lib/axios";
import type {
  MyProfileResponse,
  AuthMessageResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth.type";

export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>(
    `/auth/register`,
    data,
  );
  return response.data;
};

export const loginUser = async (
  data: LoginRequest,
): Promise<AuthMessageResponse> => {
  const response = await axiosInstance.post<AuthMessageResponse>(
    `/auth/login`,
    data,
  );
  return response.data;
};

export const getMyProfile = async (): Promise<AuthUser> => {
  const response = await axiosInstance.get<MyProfileResponse>(`/auth/me`);
  return response.data.user;
};

export const logoutUser = async (): Promise<AuthMessageResponse> => {
  const response =
    await axiosInstance.post<AuthMessageResponse>(`/auth/logout`);
  return response.data;
};
