import { useState } from "react";
import type { Cart_Item } from "../../types";
import CartRow from "../../components/cart/CartRow";
import CartTotal from "../../components/cart/CartTotal";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  // Giả lập danh sách sản phẩm cố định
  const [cartItems, setCartItems] = useState<Cart_Item[]>([
    {
      id: "1",
      name: "Áo Thun Pique Thoáng Mát",
      price: 15000000,
      quantity: 1,
      image: "/images/products/ao-thun-pique-thoang-PRD001/black/black1.webp",
    },
    {
      id: "2",
      name: "Áo Thun Pique Thoáng Mát",
      price: 5000000,
      quantity: 2,
      image: "/images/products/ao-thun-pique-thoang-PRD001/black/black1.webp",
    },
    {
      id: "3",
      name: "Quần Jean Slim Fit",
      price: 20000000,
      quantity: 1,
      image: "/images/products/ao-thun-pique-thoang-PRD001/black/black1.webp",
    },
  ]);

  const navigate = useNavigate();

  const handleRemove = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert("Chuyển đến trang thanh toán!"); // Giả lập
    navigate("/checkout"); // Route giả định
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Giỏ Hàng Của Bạn</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Giỏ hàng trống.</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            {cartItems.map((item) => (
              <CartRow key={item.id} item={item} onRemove={handleRemove} onQuantityChange={handleQuantityChange} />
            ))}
          </div>
          <CartTotal total={total} onCheckout={handleCheckout} />
        </div>
      )}
    </div>
  );
};

export default CartPage;
