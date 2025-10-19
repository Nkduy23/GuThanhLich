import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "@client/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "@client/pages/NotFound";

const Slider = lazy(() => import("../client/components/common/Slider"));
const Home = lazy(() => import("../client/pages/Home"));
const LoginPage = lazy(() => import("../client/pages/Login"));
const ProfilePage = lazy(() => import("../client/pages/Profile"));
const RegisterPage = lazy(() => import("../client/pages/Register"));
const ForgotPage = lazy(() => import("../client/pages/Forgot"));
const ResetPasswordPage = lazy(() => import("../client/pages/ResetPassword"));
const CartPage = lazy(() => import("../client/pages/Cart"));
const CategoryPage = lazy(() => import("../client/pages/Category"));
const ProductDetail = lazy(() => import("../client/pages/ProductDetail"));
const Checkout = lazy(() => import("../client/pages/Checkout"));

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

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
