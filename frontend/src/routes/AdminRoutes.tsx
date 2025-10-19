import { Route, Routes } from "react-router-dom";
import AdminLayout from "../admin/layouts/AdminLayout";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import { lazy } from "react";

const DashboardPage = lazy(() => import("../admin/pages/Dashboard"));
const UsersPage = lazy(() => import("../admin/pages/Users"));
const ProductsPage = lazy(() => import("../admin/pages/products/Products"));
const ProductFormPage = lazy(() => import("../admin/pages/products/ProductForm"));
const CategoriesPage = lazy(() => import("../admin/pages/categories/Categories"));
const CategoryFormPage = lazy(() => import("../admin/pages/categories/CategoryForm"));

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
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default AdminRoutes;
