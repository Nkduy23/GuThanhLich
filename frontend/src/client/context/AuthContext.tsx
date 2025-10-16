import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { apiRequest } from "../../api/fetcher";
import { ENDPOINTS } from "../../api/endpoints";

interface AuthContextType {
  role: string | null;
  isAuthenticated: boolean;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyAuth = async () => {
    try {
      const data = await apiRequest<{ success: boolean; user?: { role: string } }>(ENDPOINTS.me, {
        requiresAuth: true,
      });

      if (data.success && data.user) {
        setRole(data.user.role);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Verify auth error:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Verify khi mount (sau Google redirect hoặc refresh page)
  useEffect(() => {
    verifyAuth();
  }, []);

  const login = (newRole: string) => {
    setRole(newRole);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setRole(null);
    setIsAuthenticated(false);

    try {
      await apiRequest(ENDPOINTS.logout, { method: "POST", requiresAuth: true });
    } catch (error) {
      console.error("Logout error:", error);
    }

    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang kiểm tra đăng nhập...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
