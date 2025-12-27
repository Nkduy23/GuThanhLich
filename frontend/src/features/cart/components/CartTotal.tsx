import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/auth/useAuth";
import type { Voucher, CartTotalProps } from "./types";

const CartTotal: React.FC<CartTotalProps> = ({
  total,
  onCheckout,
  isAuthenticated: propAuthenticated,
}) => {
  const { isAuthenticated } = useAuth();
  const authenticated = propAuthenticated ?? isAuthenticated;

  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number): string => price.toLocaleString("vi-VN");

  const fetchAvailableVouchers = useCallback(async () => {
    if (total <= 0 || !authenticated) {
      setAvailableVouchers([]);
      if (!authenticated && total > 0) {
        // toast.info("Vui lòng đăng nhập để xem mã giảm giá");
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/cart/vouchers?total=${total}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setAvailableVouchers(data.vouchers);
      } else {
        console.warn("Fetch vouchers failed:", data.message);
      }
    } catch (err) {
      console.warn("Fetch vouchers error:", err);
    } finally {
      setLoading(false);
    }
  }, [total, authenticated]);

  useEffect(() => {
    fetchAvailableVouchers();
  }, [fetchAvailableVouchers]);

  // ✅ Fetch appliedVoucher chỉ khi authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (!authenticated) {
        setAppliedVoucher(null);
        return;
      }
      try {
        const res = await fetch("http://localhost:3000/api/cart", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized"); // ✅ Check res.ok trước
        const data = await res.json();
        if (data.success && data.data?.cart?.length > 0) {
          const firstItem = data.data.cart[0];
          if (firstItem.appliedVoucher) {
            setAppliedVoucher({
              ...firstItem.appliedVoucher,
              discountAmount: firstItem.appliedVoucher.discountAmount,
            });
          }
        }
      } catch (err) {
        console.warn("Fetch cart error:", err); // ✅ Warn thay vì error
        setAppliedVoucher(null);
      }
    };

    fetchCart();
  }, [authenticated]); // ✅ Dep chỉ authenticated, tránh re-fetch khi total change

  const handleApplyCode = async (code: string) => {
    if (!code || total <= 0 || !authenticated) {
      // ✅ Thêm check auth
      toast.warn("Vui lòng đăng nhập để áp dụng mã giảm giá");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/cart/apply-voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (data.success) {
        setAppliedVoucher({ ...data.voucher, discountAmount: data.discountAmount });
        setInputCode("");
        toast.success(data.message);
      } else {
        toast.error(
          data.message || "Mã giảm giá không hợp lệ hoặc đơn hàng không đạt mức yêu cầu!"
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Apply voucher error:", error.message);
        toast.error(error.message);
      } else {
        toast.error("Lỗi áp dụng voucher");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVoucher = async () => {
    if (!authenticated) return; // ✅ Check auth
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/cart/remove-voucher", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAppliedVoucher(null);
        toast.success("Đã xóa mã giảm giá");
      } else {
        toast.error(data.message || "Lỗi xóa voucher");
      }
    } catch (err) {
      console.error("Remove voucher error:", err);
      toast.error("Lỗi xóa voucher");
    } finally {
      setLoading(false);
    }
  };

  const discountAmount = appliedVoucher?.discountAmount || 0;
  const finalTotal = total - discountAmount;

  // Map real vouchers to mock structure for UI
  const getApplicableDiscounts = () => {
    return availableVouchers
      .filter((v) => total >= v.minTotal)
      .map((v) => ({
        id: v._id,
        code: v.code,
        discount: v.value,
        minOrder: v.minTotal,
        description:
          v.description ||
          `Giảm ${
            v.type === "fixed" ? formatPrice(v.value) + "đ" : v.value + "%"
          } cho đơn từ ${formatPrice(v.minTotal)}đ`,
      }));
  };
  return (
    <div className="space-y-4">
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Đơn Hàng</h3>
        {/* ... UI code của bạn, ví dụ hiển thị total, discount, etc. */}
        {total > 0 && !authenticated && (
          <p className="text-left text-yellow-800 mb-2">Đăng nhập để sử dụng mã giảm giá</p>
        )}
        <div className="space-y-3 border-b border-gray-400 pb-4">
          <div className="flex justify-between text-gray-700">
            <span>Tạm tính:</span>
            <span className="font-medium">{formatPrice(total)} ₫</span>
          </div>
          {appliedVoucher && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá ({appliedVoucher.code}):</span>
              <span className="font-medium">-{formatPrice(discountAmount)} ₫</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
          <span className="text-2xl font-bold text-red-600">{formatPrice(finalTotal)} ₫</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={loading}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
        >
          Đặt Hàng Ngay
        </button>
      </div>

      {/* Discount Codes Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mã Giảm Giá</h3>

        {/* Input Code */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã giảm giá"
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={() => handleApplyCode(inputCode)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm disabled:opacity-50"
          >
            {loading ? "Đang áp dụng..." : "Áp dụng"}
          </button>
        </div>

        {/* Available Discounts */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 font-medium">Mã đang có sẵn:</p>
          {loading ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Đang tải mã giảm giá...</p>
            </div>
          ) : getApplicableDiscounts().length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Hãy mua thêm để mở khóa mã giảm giá</p>
            </div>
          ) : (
            getApplicableDiscounts().map((discount) => (
              <div
                key={discount.id}
                className={`flex items-center rounded-lg border-2 p-4 transition ${
                  appliedVoucher?.code === discount.code
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-yellow-300 hover:shadow-md"
                }`}
              >
                {/* Left: Icon/Image */}
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0020.25 6v12A2.25 2.25 0 0018 20.25H6A2.25 2.25 0 003.75 18V6A2.25 2.25 0 006 3.75h1.5m9 0h-9"
                    />
                  </svg>
                </div>

                {/* Right: Content with code and details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900">
                        Giảm {formatPrice(discount.discount)}đ
                      </p>
                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        Mã: {discount.code}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{discount.description}</p>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleApplyCode(discount.code)}
                  disabled={appliedVoucher?.code === discount.code || loading}
                  className={`ml-4 px-4 py-2 rounded-lg font-medium transition text-sm ${
                    appliedVoucher?.code === discount.code
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } disabled:opacity-50`}
                >
                  {appliedVoucher?.code === discount.code ? "Đã chọn" : "Chọn"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Remove Button if applied */}
        {appliedVoucher && (
          <button
            onClick={handleRemoveVoucher}
            disabled={loading}
            className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            Xóa mã giảm giá
          </button>
        )}
      </div>
    </div>
  );
};

export default CartTotal;
