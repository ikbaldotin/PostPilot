import { useCurrentUser } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const { data: user, isPending, isError, refetch } = useCurrentUser();
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

  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
  return <div></div>;
};

export default GuestRoute;
