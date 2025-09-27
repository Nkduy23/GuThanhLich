import { Bell, LogOut, User } from "lucide-react";

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600">AdminPanel</span>
      </div>

      {/* Thanh navigation */}
      <nav className="flex items-center space-x-6">
        <button className="text-gray-600 hover:text-blue-600 transition">Dashboard</button>
        <button className="text-gray-600 hover:text-blue-600 transition">Users</button>
        <button className="text-gray-600 hover:text-blue-600 transition">Products</button>
      </nav>

      {/* User actions */}
      <div className="flex items-center space-x-4">
        <button className="relative text-gray-600 hover:text-blue-600">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
          <User className="w-5 h-5" />
          <span>Admin</span>
        </button>
        <button className="flex items-center space-x-1 text-red-500 hover:text-red-600">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
