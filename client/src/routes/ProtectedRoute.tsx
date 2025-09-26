import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
