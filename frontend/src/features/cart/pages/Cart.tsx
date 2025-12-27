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
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Đang tải giỏ hàng...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <Breadcrumb items={generateBreadcrumb([{ name: "Giỏ hàng", href: "/cart" }])} />

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <div className="mt-8 bg-white rounded-lg shadow p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-gray-600 text-lg">Giỏ hàng trống.</p>
              <img
                src="/icons/empty-cart.png"
                alt="Giỏ hàng trống"
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
              />
              <a
                href="/"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-lg underline"
              >
                Tiếp tục mua sắm →
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Phần danh sách sản phẩm */}
            <div className="lg:col-span-2">
              {/* Header trên mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <p className="text-gray-600 font-medium">{cartItems.length} sản phẩm</p>
                <button
                  onClick={handleRemoveAll}
                  className="self-start sm:self-auto text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                {/* Trên màn hình lớn dùng table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
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

                {/* Trên mobile/tablet dùng card dọc */}
                <div className="lg:hidden divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-4">
                      <CartRow
                        item={item}
                        onRemove={handleRemove}
                        onQuantityChange={handleQuantityChange}
                        onVariantChange={handleVariantChange}
                        // Có thể truyền thêm prop để CartRow biết đang ở chế độ mobile
                        isMobile={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phần tổng tiền */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <CartTotal total={total} onCheckout={handleCheckout} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
