import { getMyProfile } from "@/services/auth.service";
import type { AuthUser } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
export const AUTH_QUERY_KEY = ["auth", "me"];
export const useCurrentUser = () => {
  return useQuery<AuthUser | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        return await getMyProfile();
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
};
