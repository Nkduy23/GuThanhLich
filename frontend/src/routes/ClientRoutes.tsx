import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../pages/client/NotFoundPage";

const Slider = lazy(() => import("../components/common/Slider"));
const Home = lazy(() => import("../pages/client/Home"));
const ProductDetail = lazy(() => import("../pages/client/ProductDetail"));
const Checkout = lazy(() => import("../pages/client/CheckoutPage"));
const LoginPage = lazy(() => import("../pages/client/LoginPage"));
const RegisterPage = lazy(() => import("../pages/client/RegisterPage"));
const ForgotPage = lazy(() => import("../pages/client/ForgotPage"));
const ProfilePage = lazy(() => import("../pages/client/ProfilePage"));
const CartPage = lazy(() => import("../pages/client/CartPage"));

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
