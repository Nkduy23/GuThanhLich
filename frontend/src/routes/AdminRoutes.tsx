import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/features/admin/layouts/AdminLayout";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import { lazy } from "react";

const DashboardPage = lazy(() => import("@/features/admin/dashboard/Dashboard"));
const UsersPage = lazy(() => import("@/features/admin/users/Users"));
const ProductsPage = lazy(() => import("@/features/admin/products/pages/Products"));
const OrderPage = lazy(() => import("@/features/admin/orders/Order"));
const ProductFormPage = lazy(() => import("@/features/admin/products/components/ProductForm"));
const CategoriesPage = lazy(() => import("@/features/admin/categories/pages/Categories"));
const CategoryFormPage = lazy(() => import("@/features/admin/categories/components/CategoryForm"));

const AdminRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/create" element={<ProductFormPage />} />
            <Route path="products/edit/:id" element={<ProductFormPage />} />
            <Route path="categories" element={<CategoriesPage />}></Route>
            <Route path="categories/create" element={<CategoryFormPage />} />
            <Route path="categories/edit/:id" element={<CategoryFormPage />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="orders/:id" element={<OrderPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default AdminRoutes;
