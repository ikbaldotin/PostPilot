import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthState } from "@/hooks/use-auth-state";

const ProtectedRoute = () => {
  const { user, isLoading, isError, refetch } = useAuthState();

  const location = useLocation();

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

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
