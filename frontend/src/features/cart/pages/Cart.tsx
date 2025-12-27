import React, { useEffect } from "react";
import { toast } from "react-toastify";
import CartRow from "@/features/cart/components/CartRow";
import CartTotal from "@/features/cart/components/CartTotal";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/cart/useCart";
import { useAuth } from "@/context/auth/useAuth";
import { Breadcrumb, generateBreadcrumb } from "@/utils/breadcrumb";

const CartPage: React.FC = () => {
  const {
    hydrateLocalCartDetails,
    fetchServerCart,
    cartItems,
    total,
    loading,
    removeItem,
    removeAllItems,
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
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm ?")) {
      removeItem(id);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const handleRemoveAll = () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm không ?")) {
      removeAllItems();
      toast.success("Đã xóa tất cả sản phẩm");
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleVariantChange = (id: string, variantId: string, size: string, quantity?: number) => {
    updateVariant(id, variantId, size, quantity);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warn("Giỏ hàng trống!");
      return;
    }

    if (!isAuthenticated) {
      toast.warn("Vui lòng đăng nhập để thanh toán");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải giỏ hàng...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 my-4">
      <div className="mx-auto max-w-7xl px-4">
        <Breadcrumb items={generateBreadcrumb([{ name: "Giỏ hàng", href: "/cart" }])} />
        <h1 className="text-2xl block font-bold mb-2 text-gray-900">Giỏ Hàng Của Bạn</h1>

        {cartItems.length === 0 ? (
          <div className=" min-full bg-white rounded-lg shadow p-12 text-center">
            <div className="flex items-center justify-center flex-col">
              <p className="text-gray-600 mb-4">Giỏ hàng trống.</p>
              <img src="/icons/empty-cart.png" alt="Giỏ hàng trống"></img>
            </div>
            <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Tiếp tục mua sắm
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Cart Items */}
            <p className="text-gray-600 mb-2">({cartItems.length} sản phẩm)</p>
            <div className="text-right lg:col-span-1">
              <button
                onClick={handleRemoveAll}
                className="text-sm bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
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
                    {cartItems.map((item) => {
                      return (
                        <CartRow
                          key={item._id}
                          item={item}
                          onRemove={handleRemove}
                          onQuantityChange={handleQuantityChange}
                          onVariantChange={handleVariantChange}
                        />
                      );
                    })}
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
