import { logoutUser } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEY } from "./use-auth";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      toast.success("Logged out successfully!");
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });
};
