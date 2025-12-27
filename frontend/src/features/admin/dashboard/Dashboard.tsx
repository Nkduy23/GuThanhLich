// admin/pages/Dashboard.tsx (fixed - use <Line /> and <Bar />)
import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
  message: string;
  totals: {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
  };
  revenue: {
    totalRevenue: number;
    avgOrderValue: number;
  };
  charts: {
    monthlySales: Array<{ month: string; total: number; count: number }>;
    topCategories: Array<{ name: string; sales: number }>;
  };
  recentOrders: Array<{
    _id: string;
    grandTotal: number;
    status: string;
    createdAt: string;
    userId: { name: string };
    addressId: { name: string; city: string };
  }>;
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
      } catch (err) {
        setError("Không thể kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatPrice = (price: number): string => price.toLocaleString("vi-VN") + " ₫";

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  if (!data) return <div>Không có dữ liệu.</div>;

  // Line Chart: Monthly Sales
  const lineData: ChartData<"line"> = {
    labels: data.charts.monthlySales.map((m) => m.month),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: data.charts.monthlySales.map((m) => m.total),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Số đơn",
        data: data.charts.monthlySales.map((m) => m.count),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };

  // Bar Chart: Top Categories
  const barData: ChartData<"bar"> = {
    labels: data.charts.topCategories.map((c) => c.name),
    datasets: [
      {
        label: "Doanh thu",
        data: data.charts.topCategories.map((c) => c.sales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">{data.message}</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{data.totals.totalUsers}</div>
            <div className="text-gray-600">Tổng người dùng</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{data.totals.totalOrders}</div>
            <div className="text-gray-600">Tổng đơn hàng</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{data.totals.totalProducts}</div>
            <div className="text-gray-600">Tổng sản phẩm</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {formatPrice(data.revenue.totalRevenue)}
            </div>
            <div className="text-gray-600">Tổng doanh thu</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Doanh thu trung bình đơn hàng</h3>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(data.revenue.avgOrderValue)}
            </div>
          </div>

          {/* Conversion Rate Placeholder */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Tỷ lệ chuyển đổi (giả định)</h3>
            <div className="text-2xl font-bold text-purple-600">12.5%</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Doanh thu theo tháng</h3>
            <Line data={lineData} options={lineOptions} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Top danh mục bán chạy</h3>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <h3 className="text-xl font-semibold p-6 border-b">Đơn hàng gần đây</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.userId?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.addressId?.name}, {order.addressId?.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatPrice(order.grandTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
