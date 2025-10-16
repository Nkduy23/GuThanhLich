import React, { useEffect } from "react";
import CartRow from "../components/cart/CartRow";
import CartTotal from "../components/cart/CartTotal";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartPage: React.FC = () => {
  const {
    hydrateLocalCartDetails,
    fetchServerCart,
    cartItems,
    total,
    loading,
    removeItem,
    updateVariant,
    updateQuantity,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const initCart = async () => {
      if (isAuthenticated) {
        await fetchServerCart();
      } else {
        await hydrateLocalCartDetails();
      }
    };
    initCart();
  }, [isAuthenticated, fetchServerCart, hydrateLocalCartDetails]);

  const handleRemove = (id: string) => {
    alert("Bạn có chắc muốn xóa sản phẩm ?");
    removeItem(id);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleVariantChange = (id: string, variantId: string, size: string, quantity?: number) => {
    updateVariant(id, variantId, size, quantity);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải giỏ hàng...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Giỏ Hàng Của Bạn</h1>
        <p className="text-gray-600 mb-8">({cartItems.length} sản phẩm)</p>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">Giỏ hàng trống.</p>
            <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Tiếp tục mua sắm
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                        Hình ảnh
                      </th>
                      <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                        Sản phẩm
                      </th>
                      <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                        Màu sắc
                      </th>
                      <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                        Size
                      </th>
                      <th className="py-4 px-4 text-center text-sm font-semibold text-gray-900">
                        SL
                      </th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                        Đơn giá
                      </th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                        Thành tiền
                      </th>
                      <th className="py-4 px-4 text-center text-sm font-semibold text-gray-900">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <CartRow
                        key={item._id}
                        item={item}
                        onRemove={handleRemove}
                        onQuantityChange={handleQuantityChange}
                        onVariantChange={handleVariantChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column - Total & Discount */}
            <div className="lg:col-span-1">
              <CartTotal total={total} onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
