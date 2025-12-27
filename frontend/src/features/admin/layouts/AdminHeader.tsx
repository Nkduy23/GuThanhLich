import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/auth/useAuth";
import { useNavigate } from "react-router-dom";

const AdminHeader: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Page Title */}
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>

      {/* User actions */}
      <div className="flex items-center space-x-4">
        <button className="relative text-gray-600 hover:text-blue-600">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
          <User className="w-5 h-5" />
          <span>Admin</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-red-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
