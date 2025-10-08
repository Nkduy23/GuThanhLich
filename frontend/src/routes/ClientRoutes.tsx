import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../client/pages/NotFoundPage";

const Slider = lazy(() => import("../client/components/common/Slider"));
const Home = lazy(() => import("../client/pages/Home"));
const CategoryPage = lazy(() => import("../client/pages/CategoryPage"));
const ProductDetail = lazy(() => import("../client/pages/ProductDetail"));
const Checkout = lazy(() => import("../client/pages/CheckoutPage"));
const LoginPage = lazy(() => import("../client/pages/LoginPage"));
const RegisterPage = lazy(() => import("../client/pages/RegisterPage"));
const ForgotPage = lazy(() => import("../client/pages/ForgotPage"));
const ProfilePage = lazy(() => import("../client/pages/ProfilePage"));
const CartPage = lazy(() => import("../client/pages/CartPage"));

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
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* ✅ Catch all routes sai ở client */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
