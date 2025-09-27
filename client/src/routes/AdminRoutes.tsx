// routes/AdminRoutes.tsx
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import { lazy } from "react";

const DashboardPage = lazy(() => import("../pages/admin/Dashboard"));

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route admin được bảo vệ */}
      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
