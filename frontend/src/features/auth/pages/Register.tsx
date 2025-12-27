import { useNavigate } from "react-router-dom";
import RegisterForm from "@/features/auth/components/RegisterForm";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate("/login");
  };
  return (
    <div className="max-w-md mx-auto my-15 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </div>
  );
};

export default RegisterPage;
