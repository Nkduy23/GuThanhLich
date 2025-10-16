import React, { useState, useEffect } from "react";

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cart", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.data?.cart) {
          const mapped = data.data.cart.map((item: any) => ({
            _id: item._id,
            name: item.name,
            image: item.image,
            color: item.color,
            size: item.size,
            price: item.unit_price,
            quantity: item.quantity,
          }));
          setCartItems(mapped);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    console.log("Checkout:", { cartItems, shippingInfo, total });
    alert("Đặt hàng thành công (fake)!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-600">
        Đang tải giỏ hàng...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Thanh Toán</h1>
        <p className="text-gray-600 mb-8">({cartItems.length} sản phẩm)</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Shipping Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Thông Tin Giao Hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nhập họ và tên"
                    value={shippingInfo.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Nhập địa chỉ giao hàng"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (nếu có)
                  </label>
                  <textarea
                    name="note"
                    placeholder="Nhập ghi chú thêm"
                    value={shippingInfo.note}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Đơn Hàng Của Bạn</h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Giỏ hàng trống.</p>
              ) : (
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3 pb-4 border-b last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.color} | Size {item.size}
                        </p>
                        <p className="text-xs text-gray-700 mt-1">
                          {item.quantity} x {item.price.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm flex-shrink-0">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{total.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {total.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Đặt Hàng Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
