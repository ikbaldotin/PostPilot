import { Navigate, Outlet } from "react-router-dom";

import { useAuthState } from "@/hooks/use-auth-state";

const GuestRoute = () => {
  const { user, isLoading, isError, refetch } = useAuthState();

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (isError) {
    return (
      <div>
        <p>Unable to verify your session.</p>
        <button onClick={() => void refetch()}>Try again</button>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
