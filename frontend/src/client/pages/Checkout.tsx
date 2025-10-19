import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Breadcrumb, generateBreadcrumb } from "@utils/breadcrumb";

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface AppliedVoucher {
  code: string;
  type: "fixed" | "percentage";
  discountAmount: number;
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [loading, setLoading] = useState(true);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod", // Default COD (add to state)
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

          // ✅ Extract appliedVoucher from first item (saved in DB)
          if (mapped.length > 0 && data.data.cart[0].appliedVoucher) {
            const voucher = data.data.cart[0].appliedVoucher;
            setAppliedVoucher({
              code: voucher.code,
              type: voucher.type,
              discountAmount: voucher.discountAmount,
            });
          }
        } else {
          setCartItems([]);
          setAppliedVoucher(null);
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
        toast.error("Lỗi tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ Safe format function
  const formatPrice = (price: number | undefined): string => (price || 0).toLocaleString("vi-VN");

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedVoucher?.discountAmount || 0;
  const finalTotal = subtotal - discountAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    console.log("Checkout:", {
      cartItems,
      shippingInfo,
      subtotal,
      discountAmount,
      finalTotal,
      voucher: appliedVoucher,
    });
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
    <div className="min-h-screen bg-gray-50 my-4">
      <div className="mx-auto max-w-7xl px-4">
        <Breadcrumb items={generateBreadcrumb([{ name: "Thanh Toán", href: "/checkout" }])} />
        <div className="flex gap-6 items-center mb-4">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Thanh Toán</h1>
          <p className="text-gray-600">({cartItems.length} sản phẩm)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
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

                {/* Phương thức thanh toán */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={shippingInfo.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={shippingInfo.paymentMethod === "bank"}
                        onChange={handleChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Chuyển khoản ngân hàng</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="momo"
                        checked={shippingInfo.paymentMethod === "momo"}
                        onChange={handleChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Ví MoMo</span>
                    </label>
                  </div>
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
                    <div
                      key={item._id}
                      className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0"
                    >
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
                          {item.quantity} x {formatPrice(item.price)} ₫
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm flex-shrink-0">
                        {formatPrice(item.price * item.quantity)} ₫
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-400 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{formatPrice(subtotal)} ₫</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({appliedVoucher.code}):</span>
                    <span className="font-medium">-{formatPrice(discountAmount)} ₫</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="border-t border-gray-500 pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(finalTotal)} ₫
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
