// admin/pages/OrdersPage.tsx (updated from <div>Order</div>)
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Order } from "@admin/types";

const OrdersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");

  const fetchOrders = async (page = 1, status = "all", searchQuery = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(status !== "all" && { status }),
        ...(searchQuery && { search: searchQuery }),
      });
      const res = await fetch(`http://localhost:3000/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setTotal(data.total);
        setPages(data.pages);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail(id);
    } else {
      fetchOrders(1, selectedStatus, search);
    }
  }, [id, currentPage, selectedStatus, search]);

  const fetchOrderDetail = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/admin/orders/${orderId}`);
      const data = await res.json();
      if (data.success) {
        // Set to state or render detail
        setOrders([data.order]); // Temp for detail view
      }
    } catch (err) {
      console.error("Fetch order detail error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh list or update local
        fetchOrders(currentPage, selectedStatus, search);
      }
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const progression = {
      pending: "confirmed",
      confirmed: "shipped",
      shipped: "delivered",
      delivered: null,
      cancelled: null,
    };
    return progression[currentStatus as keyof typeof progression];
  };

  const formatPrice = (price: number): string => price.toLocaleString("vi-VN");

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;

  if (id) {
    // Detail view
    const order = orders[0];
    if (!order) return <div>Order not found</div>;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/admin/orders")}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            ← Back to Orders
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Order Detail #{order._id.slice(-8)}
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">Date: {formatDate(order.createdAt)}</p>
                <p className="text-gray-600">Customer: {order.userId?.name}</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${getStatusBadge(order.status)}`}>
                {order.status.toUpperCase()}
              </div>
            </div>

            {/* Address */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>
                  {order.addressId?.name} - {order.addressId?.phone}
                </p>
                <p>
                  {order.addressId?.address}, {order.addressId?.city}, {order.addressId?.country}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p>{order.paymentMethod.toUpperCase()}</p>
                <h3 className="font-semibold mt-4 mb-2">
                  Total: {formatPrice(order.grandTotal)} ₫
                </h3>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Items ({order.orderDetails.length})</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Image</th>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Variant</th>
                      <th className="px-4 py-2 text-right">Qty</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderDetails.map((detail, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">
                          <img
                            src={detail.variantId?.images?.[0] || "/placeholder.jpg"}
                            alt="Product"
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-2">{detail.variantId?.productId?.name}</td>
                        <td className="px-4 py-2">Color: {detail.variantId?.color}</td>
                        <td className="px-4 py-2 text-right">{detail.quantity}</td>
                        <td className="px-4 py-2 text-right">{formatPrice(detail.unit_price)} ₫</td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {formatPrice(detail.total_price)} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex gap-2">
              {getNextStatus(order.status) && (
                <button
                  onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status)!)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update to {getNextStatus(order.status)?.toUpperCase()}
                </button>
              )}
              {order.status !== "cancelled" && (
                <button
                  onClick={() => handleStatusUpdate(order._id, "cancelled")}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Orders Management</h1>
        <p className="text-gray-600 mb-8">Total: {total} orders</p>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by ID, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => fetchOrders(1, selectedStatus, search)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.userId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderDetails?.length || 0} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatPrice(order.grandTotal)} ₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status)!)}
                        className="text-green-600 hover:text-green-900"
                      >
                        {getNextStatus(order.status)?.toUpperCase()}
                      </button>
                    )}
                    {order.status !== "cancelled" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, "cancelled")}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mt-6 flex justify-between items-center">
            <div>
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, total)} of {total}{" "}
              orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                {currentPage} / {pages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
                disabled={currentPage === pages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
