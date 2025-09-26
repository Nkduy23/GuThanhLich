import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("storageUpdate"));
    navigate("/");
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
