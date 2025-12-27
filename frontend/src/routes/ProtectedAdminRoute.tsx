import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";

const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedAdminRoute;
