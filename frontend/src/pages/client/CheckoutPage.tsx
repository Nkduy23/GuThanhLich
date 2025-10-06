import React, { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

const Checkout: React.FC = () => {
  // Data giả
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Áo Thun Pique Thoáng Mát",
      image: "/images/products/ao-thun-pique-thoang-PRD001/black/black1.webp",
      price: 199000,
      quantity: 2,
      size: "M",
      color: "Đen",
    },
    {
      id: "2",
      name: "Quần Jean Slim Fit",
      image: "/images/products/ao-thun-pique-thoang-PRD001/black/black1.webp",
      price: 399000,
      quantity: 1,
      size: "L",
      color: "Xanh",
    },
  ]);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    console.log("Checkout:", {
      cartItems,
      shippingInfo,
      total,
    });
    alert("Đặt hàng thành công (fake)!");
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Thông tin giao hàng */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Thông tin giao hàng</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={shippingInfo.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={shippingInfo.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={shippingInfo.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
          <textarea
            name="note"
            placeholder="Ghi chú (nếu có)"
            value={shippingInfo.note}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          ></textarea>
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Đơn hàng của bạn</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Màu: {item.color} | Size: {item.size}
                </p>
                <p className="text-sm">
                  {item.quantity} x {item.price.toLocaleString("vi-VN")} đ
                </p>
              </div>
              <p className="font-semibold">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between font-medium text-lg">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{total.toLocaleString("vi-VN")} đ</span>
          </div>
          <button onClick={handleCheckout} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
