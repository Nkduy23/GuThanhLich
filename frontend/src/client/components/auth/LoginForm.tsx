import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthForm from "../../../hooks/useAuthForm";

interface LoginFormProps {
  onSuccess: (token: string, role: string) => void;
}

interface LoginResponse {
  token: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { error, loading, handleSubmit } = useAuthForm<LoginResponse>(
    "http://localhost:3000/api/auth/login",
    (data) => onSuccess(data.token, "")
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ email, password });
  };

  return (
    <>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đăng Nhập"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/register" className="text-blue-600 hover:underline">
          Đăng ký tài khoản mới
        </Link>
        <br />
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Quên mật khẩu?
        </Link>
      </div>
    </>
  );
};

export default LoginForm;
