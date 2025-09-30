import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import { lazy } from "react";

const DashboardPage = lazy(() => import("../pages/admin/Dashboard"));
const UsersPage = lazy(() => import("../pages/admin/Users"));
const ProductsPage = lazy(() => import("../pages/admin/Products"));
const CategoriesPage = lazy(() => import("../pages/admin/Categories"));

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route admin được bảo vệ */}
      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
