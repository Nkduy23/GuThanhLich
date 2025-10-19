import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ENDPOINTS } from "@api/endpoints";
import useAuthForm from "@hooks/useAuthForm";

interface LoginFormProps {
  onSuccess: (role: string) => void;
}
interface LoginResponse {
  role: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, handleSubmit } = useAuthForm<LoginResponse>(ENDPOINTS.login, (data) =>
    onSuccess(data.role)
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ userName, password });
  };

  const handleGoogleLogin = () => {
    window.location.href = ENDPOINTS.google;
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Tài khoản
          </label>
          <input
            type="name"
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-6 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mật khẩu
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đăng Nhập"}
        </button>
      </form>

      {/* Nút Google mới */}
      <div className="mt-4 text-center">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Đăng nhập bằng Google
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link
          to="/register"
          className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors duration-200"
        >
          Đăng ký tài khoản mới
        </Link>
        <br />
        <Link
          to="/forgot-password"
          className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors duration-200"
        >
          Quên mật khẩu?
        </Link>
      </div>
    </>
  );
};

export default LoginForm;
