import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuth();

  const { mergeLocalCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      mergeLocalCart();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (role: string) => {
    login(role);
    navigate(role === "admin" ? "/admin" : "/");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get("error");
    if (error) {
      console.error("Auth failed:", error);
      return;
    }

    if (isAuthenticated && role) {
      navigate(role === "admin" ? "/admin" : "/");
    }
  }, [location, navigate, isAuthenticated, role]);

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
