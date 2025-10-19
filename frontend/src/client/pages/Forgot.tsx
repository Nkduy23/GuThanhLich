import { useNavigate } from "react-router-dom";
import ForgotForm from "../components/auth/ForgotForm";

const ForgotPage: React.FC = () => {
  const navigate = useNavigate();

  const handleForgotSuccess = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto my-15 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
      <ForgotForm onSuccess={handleForgotSuccess} />
    </div>
  );
};

export default ForgotPage;
