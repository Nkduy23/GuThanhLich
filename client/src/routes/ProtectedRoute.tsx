import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // render route con
};

export default ProtectedRoute;
