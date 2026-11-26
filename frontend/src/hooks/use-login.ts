import { loginUser } from "@/services/auth.service";
import type { LoginRequest } from "@/types/auth.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEY } from "./use-auth";
import { toast } from "sonner";

export const useLogin = () => {
  const querClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: async () => {
      await querClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEY,
      });
      toast.success("Login successful!");
    },
    onError: () => {
      toast.error("Login failed. Please check your credentials.");
    },
  });
};
