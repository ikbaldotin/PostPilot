import { useLogout } from "@/hooks/use-logout";
import { useAuthState } from "@/hooks/use-auth-state";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const logoutMutation = useLogout();
  const { user } = useAuthState();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="flex items-center justify-between border-b bg-background px-8 py-5">
        <h1 className="text-2xl font-bold tracking-tight">PostPilot</h1>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold">PostPilot Dashboard</h2>
        <p className="mt-2 text-muted-foreground">Welcome, {user?.name}!</p>
      </main>
    </div>
  );
};

export default DashboardPage;
