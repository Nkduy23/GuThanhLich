import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("❌ Vui lòng nhập đầy đủ mật khẩu");
    }

    if (password !== confirmPassword) {
      return toast.error("❌ Mật khẩu không khớp nhau");
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      toast.error("⚠️ Lỗi hệ thống, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Đặt lại mật khẩu</h2>

        {email && (
          <p className="text-center text-sm text-gray-500 mb-4">
            Cho tài khoản: <span className="font-medium">{email}</span>
          </p>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 text-sm">Mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 text-sm">Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
