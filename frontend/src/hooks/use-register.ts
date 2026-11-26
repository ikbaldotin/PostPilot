import { registerUser } from "@/services/auth.service";
import type { RegisterRequest } from "@/types/auth.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEY } from "./use-auth";
import { toast } from "sonner";

export const useRegister = () => {
  const querClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: async () => {
      await querClient.invalidateQueries({
        queryKey: AUTH_QUERY_KEY,
      });
      toast.success("Account created successfully!");
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });
};
