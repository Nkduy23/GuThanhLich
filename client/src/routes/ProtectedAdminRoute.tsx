// routes/ProtectedAdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";

const ProtectedAdminRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ví dụ bạn lưu role khi login

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />; // user thường vào admin thì đá về Home
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
