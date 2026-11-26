import { useCurrentUser } from "@/hooks/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: user, isPending, isError, refetch } = useCurrentUser();
  const location = useLocation();
  if (isPending) {
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
