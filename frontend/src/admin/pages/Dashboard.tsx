import { useEffect, useState } from "react";

interface DashboardData {
  message: string;
  totalUsers?: number;
  totalOrders?: number;
  totalProducts?: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.message || "Lỗi tải dashboard");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Không thể kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {data ? (
        <div className="space-y-4">
          <p className="text-lg">{data.message}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-100 rounded-lg text-center">
              <h2 className="text-xl font-semibold">{data.totalUsers ?? 0}</h2>
              <p className="text-gray-700">Người dùng</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg text-center">
              <h2 className="text-xl font-semibold">{data.totalOrders ?? 0}</h2>
              <p className="text-gray-700">Đơn hàng</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg text-center">
              <h2 className="text-xl font-semibold">{data.totalProducts ?? 0}</h2>
              <p className="text-gray-700">Sản phẩm</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Không có dữ liệu.</p>
      )}
    </div>
  );
};

export default Dashboard;
