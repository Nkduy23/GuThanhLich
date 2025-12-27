// components/profile/OrdersTab.tsx (new)
import { useState } from "react";
import type { Order } from "@/features/types";
import { Clock, MapPin, CreditCard, Package } from "lucide-react";

const OrdersTab: React.FC<{ orders: Order[]; loading: boolean }> = ({ orders, loading }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const formatPrice = (price: number): string => price.toLocaleString("vi-VN");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow-md">Đang tải đơn hàng...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Package size={20} className="text-gray-500" />
                  <div>
                    <p className="font-medium">Đơn hàng #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(order.grandTotal)} ₫
                  </span>
                </div>
              </div>

              {/* Address & Payment */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Giao đến:</p>
                    <p>
                      {order.addressId.name} - {order.addressId.phone}
                    </p>
                    <p>
                      {order.addressId.address}, {order.addressId.city}, {order.addressId.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard size={16} className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Thanh toán:</p>
                    <p>{order.paymentMethod.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Items Summary - Expandable */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() =>
                    setExpandedOrderId(expandedOrderId === order._id ? null : order._id)
                  }
                  className="w-full text-left flex justify-between items-center text-blue-600 hover:text-blue-800"
                >
                  <span>Xem chi tiết ({order.orderDetails.length} sản phẩm)</span>
                  <Clock
                    size={16}
                    className={`transition-transform ${
                      expandedOrderId === order._id ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedOrderId === order._id && (
                  <div className="mt-4 space-y-3">
                    {order.orderDetails.map((detail, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded">
                        <img
                          src={detail.variantId.images?.[0] || "/placeholder.jpg"}
                          alt="Product"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Sản phẩm {idx + 1}</p>
                          <p className="text-xs text-gray-600">Màu: {detail.variantId.color}</p>
                          <p className="text-xs">
                            SL: {detail.quantity} x {formatPrice(detail.unit_price)} ₫
                          </p>
                        </div>
                        <p className="font-semibold text-sm">{formatPrice(detail.total_price)} ₫</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
