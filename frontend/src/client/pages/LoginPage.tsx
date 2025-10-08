import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  interface TokenPayload {
    id: string;
    role: string;
    exp: number;
  }

  const handleLoginSuccess = (token: string) => {
    const decoded = jwtDecode<TokenPayload>(token);
    localStorage.setItem("token", token);
    localStorage.setItem("role", decoded.role);
    login(token, decoded.role);
    navigate(decoded.role === "admin" ? "/admin" : "/");
  };

  return (
    <div className="max-w-md mx-auto my-15 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
