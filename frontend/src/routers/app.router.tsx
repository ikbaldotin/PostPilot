import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/common/protected-route";
import DashboardPage from "@/pages/dashboard.page";
import NotFoundPage from "@/pages/NotFound.page";
import LoginPage from "@/pages/login.page";
import RegisterPage from "@/pages/register.page";
import GuestRoute from "@/components/common/guest-route";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
