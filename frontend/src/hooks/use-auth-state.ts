import { useCurrentUser } from "./use-auth";

export const useAuthState = () => {
  const { data: user, isPending, isError, refetch } = useCurrentUser();
  return {
    user: user ?? null,
    isAuthenticated: Boolean(user),
    isLoading: isPending,
    isError,
    refetch,
  };
};
