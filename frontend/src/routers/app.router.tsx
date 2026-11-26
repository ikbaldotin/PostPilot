import DashboardPage from "@/pages/dashboard.page";
import NotFoundPage from "@/pages/NotFound.page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
