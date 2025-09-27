import { Outlet } from "react-router-dom";
import AdminHeader from "../components/layout/AdminHeader";
import AdminFooter from "../components/layout/AdminFooter";

const AdminLayout: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <AdminHeader />
      <main className="p-6">
        <Outlet /> {/* Tất cả route con của admin sẽ render ở đây */}
      </main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
