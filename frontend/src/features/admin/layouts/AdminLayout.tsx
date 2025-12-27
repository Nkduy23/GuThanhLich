import { Outlet, NavLink } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import {
  Home,
  Users,
  Package,
  Tag,
  ShoppingCart,
  Truck,
  LayoutDashboard,
  Percent,
  Image,
  FileText,
  Settings,
  Store,
  Shirt,
  ClipboardList,
} from "lucide-react";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `w-full flex items-center px-6 py-3 rounded-md transition ${
    isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
  }`;

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
          {/* Dashboard */}
          <NavLink to="/admin" end className={navItemClass}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>

          {/* Products Section */}
          <div className="mt-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Products
          </div>
          <NavLink to="/admin/products" className={navItemClass}>
            <Shirt className="w-5 h-5 mr-3" />
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={navItemClass}>
            <Package className="w-5 h-5 mr-3" />
            Categories
          </NavLink>
          <NavLink to="/admin/brands" className={navItemClass}>
            <Tag className="w-5 h-5 mr-3" />
            Brands
          </NavLink>
          <NavLink to="/admin/collections" className={navItemClass}>
            <Store className="w-5 h-5 mr-3" />
            Collections
          </NavLink>

          {/* Orders Section */}
          <div className="mt-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Orders
          </div>
          <NavLink to="/admin/orders" className={navItemClass}>
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </NavLink>
          <NavLink to="/admin/returns" className={navItemClass}>
            <Truck className="w-5 h-5 mr-3" />
            Returns
          </NavLink>

          {/* Customers Section */}
          <div className="mt-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Customers
          </div>
          <NavLink to="/admin/users" className={navItemClass}>
            <Users className="w-5 h-5 mr-3" />
            Users
          </NavLink>
          <NavLink to="/admin/customer-groups" className={navItemClass}>
            <ClipboardList className="w-5 h-5 mr-3" />
            Customer Groups
          </NavLink>

          {/* Marketing Section */}
          <div className="mt-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Marketing
          </div>
          <NavLink to="/admin/coupons" className={navItemClass}>
            <Percent className="w-5 h-5 mr-3" />
            Coupons
          </NavLink>
          <NavLink to="/admin/promotions" className={navItemClass}>
            <Tag className="w-5 h-5 mr-3" />
            Promotions
          </NavLink>

          {/* Content Section */}
          <div className="mt-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Content
          </div>
          <NavLink to="/admin/banners" className={navItemClass}>
            <Image className="w-5 h-5 mr-3" />
            Banners
          </NavLink>
          <NavLink to="/admin/blogs" className={navItemClass}>
            <FileText className="w-5 h-5 mr-3" />
            Blogs
          </NavLink>
          <NavLink to="/admin/pages" className={navItemClass}>
            <FileText className="w-5 h-5 mr-3" />
            Pages
          </NavLink>

          {/* Settings */}
          <div className="mt-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            System
          </div>
          <NavLink to="/admin/staff" className={navItemClass}>
            <Users className="w-5 h-5 mr-3" />
            Staff
          </NavLink>
          <NavLink to="/admin/settings" className={navItemClass}>
            <Settings className="w-5 h-5 mr-3" />
            Settings
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
