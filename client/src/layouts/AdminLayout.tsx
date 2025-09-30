import { Outlet, NavLink } from "react-router-dom";
import AdminHeader from "../components/layout/AdminHeader";
import AdminFooter from "../components/layout/AdminFooter";
import { Home, Users, Package } from "lucide-react";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-200">
          <span className="text-2xl font-bold text-blue-600">AdminPanel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `w-full flex items-center px-6 py-3 rounded-md transition ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `w-full flex items-center px-6 py-3 rounded-md transition ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `w-full flex items-center px-6 py-3 rounded-md transition ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `w-full flex items-center px-6 py-3 rounded-md transition ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            <Package className="w-5 h-5 mr-3" />
            Categories
          </NavLink>
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
