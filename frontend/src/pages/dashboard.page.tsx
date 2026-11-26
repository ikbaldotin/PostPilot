import { useLogout } from "@/hooks/use-logout";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="flex items-center justify-between border-b bg-background px-8 py-5">
        <h1 className="text-2xl font-bold tracking-tight">PostPilot</h1>

        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold">PostPilot Dashboard</h2>

        <p className="mt-2 text-muted-foreground">Welcome to PostPilot.</p>
      </main>
    </div>
  );
};

export default DashboardPage;
