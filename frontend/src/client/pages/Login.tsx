import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "@client/components/auth/LoginForm";
import { useAuth } from "@context/auth/useAuth";
import { useCart } from "@context/cart/useCart";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuth();
  const { mergeLocalCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      mergeLocalCart();
    }
  }, [isAuthenticated, mergeLocalCart]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get("error");
    if (error) {
      console.error("Auth failed:", error);
      return;
    }

    if (isAuthenticated && role) {
      const redirectPath = location.state?.from || (role === "admin" ? "/admin" : "/");
      navigate(redirectPath);
    }
  }, [location, navigate, isAuthenticated, role]);

  const handleLoginSuccess = (role: string) => {
    login(role);

    // Nếu người dùng đến từ 1 trang cụ thể (vd: checkout) thì quay lại đó
    const redirectPath = location.state?.from || (role === "admin" ? "/admin" : "/");
    navigate(redirectPath);
  };

  if (isAuthenticated && role) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto my-15 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
