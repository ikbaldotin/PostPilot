import AppRouter from "@/routers/app.router";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
};

export default App;
