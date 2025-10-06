import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthForm from "../../hooks/useAuthForm";

interface ForgotFormProps {
  onSuccess: () => void;
}

const ForgotForm: React.FC<ForgotFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");

  const { error, loading, handleSubmit } = useAuthForm("http://localhost:3000/api/auth/register", () => onSuccess());

  return (
    <>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit({ email });
        }}
      >
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
          {loading ? "Đang xử lý..." : "Quên Mật Khẩu"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    </>
  );
};

export default ForgotForm;
