import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "@/features/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "@/pages/NotFound";

const Slider = lazy(() => import("@/components/common/Slider"));
const Home = lazy(() => import("@/features/home/page/Home"));
const LoginPage = lazy(() => import("@/features/auth/pages/Login"));
const ProfilePage = lazy(() => import("@/features/profile/pages/Profile"));
const RegisterPage = lazy(() => import("@/features/auth/pages/Register"));
const ForgotPage = lazy(() => import("@/features/auth/pages/Forgot"));
const ResetPasswordPage = lazy(() => import("@/features/auth/pages/ResetPassword"));
const CartPage = lazy(() => import("@/features/cart/pages/Cart"));
const CategoryPage = lazy(() => import("@/features/product/pages/Category"));
const ProductDetail = lazy(() => import("@/features/product/pages/ProductDetail"));
const Checkout = lazy(() => import("@/features/cart/pages/Checkout"));
const Thanks = lazy(() => import("@/pages/Thanks"));

const ClientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <>
              <Slider />
              <Home />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route path="/order-success" element={<Thanks />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
