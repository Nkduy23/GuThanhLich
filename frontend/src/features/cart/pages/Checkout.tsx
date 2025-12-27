// client/pages/Checkout.tsx (updated)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Breadcrumb, generateBreadcrumb } from "@/utils/breadcrumb";

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  variantId: string; // Add for backend
}

interface AppliedVoucher {
  _id?: string;
  code: string;
  type: "fixed" | "percentage";
  discountAmount: number;
}

interface UserAddress {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "Việt Nam", // Default
    note: "",
    paymentMethod: "cod",
    selectedAddressId: "", // For existing address
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/checkout", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setAddresses(data.addresses || []);
          if (data.cartSummary?.items) {
            const mapped = data.cartSummary.items.map((item: any) => ({
              _id: item._id,
              name: item.name,
              image: item.image,
              color: item.color,
              size: item.size,
              price: item.unit_price,
              quantity: item.quantity,
              variantId: item.variantId, // Ensure from API
            }));
            setCartItems(mapped);
            if (data.cartSummary.appliedVoucher) {
              setAppliedVoucher(data.cartSummary.appliedVoucher);
            }
          }
        } else {
          toast.error(data.message || "Lỗi tải dữ liệu");
        }
      } catch (err) {
        console.error("Fetch checkout error:", err);
        toast.error("Lỗi tải dữ liệu checkout");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  // Safe format function
  const formatPrice = (price: number | undefined): string => (price || 0).toLocaleString("vi-VN");

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedVoucher?.discountAmount || 0;
  const finalTotal = subtotal - discountAmount;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (address: UserAddress) => {
    setShippingInfo({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      country: address.country,
      note: "",
      paymentMethod: "cod",
      selectedAddressId: address._id,
    });
  };

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      const submitData = {
        ...shippingInfo,
        selectedAddressId: shippingInfo.selectedAddressId || undefined, // Use existing if selected
      };

      const res = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Đặt hàng thành công!");
        navigate("/order-success", { state: { orderId: data.order._id } }); // Or /orders
      } else {
        toast.error(data.message || "Lỗi đặt hàng");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Lỗi đặt hàng");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-600">Đang tải...</div>
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

              {/* Existing Addresses */}
              {addresses.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ đã lưu
                  </label>
                  <div className="space-y-2 mb-4">
                    {addresses.map((addr) => (
                      <button
                        key={addr._id}
                        onClick={() => handleAddressSelect(addr)}
                        className={`w-full p-3 border rounded-lg text-left ${
                          shippingInfo.selectedAddressId === addr._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <p className="font-medium">
                          {addr.name} - {addr.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.address}, {addr.city}, {addr.country}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nhập họ và tên"
                    value={shippingInfo.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Số nhà, đường"
                      value={shippingInfo.address}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố
                    </label>
                    <select
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn thành phố</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. HCM">TP. HCM</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      {/* Add more cities */}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quốc gia</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleChange}
                    required
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
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                      { value: "bank", label: "Chuyển khoản ngân hàng" },
                      { value: "momo", label: "Ví MoMo" },
                    ].map((method) => (
                      <label key={method.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={shippingInfo.paymentMethod === method.value}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary (unchanged) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
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
                disabled={
                  submitting ||
                  cartItems.length === 0 ||
                  !shippingInfo.name ||
                  !shippingInfo.phone ||
                  !shippingInfo.address ||
                  !shippingInfo.city
                }
                className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {submitting ? "Đang xử lý..." : "Đặt Hàng Ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
