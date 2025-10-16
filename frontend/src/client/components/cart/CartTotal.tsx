import { useState } from "react";

// Mock discount codes
const MOCK_DISCOUNTS = [
  {
    id: 1,
    code: "DISCOUNT120",
    discount: 120000,
    minOrder: 999000,
    description: "Đơn hàng từ 999,000đ trở lên",
  },
  {
    id: 2,
    code: "DISCOUNT80",
    discount: 80000,
    minOrder: 699000,
    description: "Đơn hàng từ 699,000đ trở lên",
  },
  {
    id: 3,
    code: "DISCOUNT40",
    discount: 40000,
    minOrder: 395000,
    description: "Đơn hàng từ 395,000đ trở lên",
  },
];

interface CartTotalProps {
  total: number;
  onCheckout: () => void;
}

const CartTotal: React.FC<CartTotalProps> = ({ total, onCheckout }) => {
  const [appliedCode, setAppliedCode] = useState<(typeof MOCK_DISCOUNTS)[0] | null>(null);
  const [inputCode, setInputCode] = useState("");

  const getApplicableDiscounts = () => {
    return MOCK_DISCOUNTS.filter((d) => total >= d.minOrder);
  };

  const handleApplyCode = (code: string) => {
    const discount = MOCK_DISCOUNTS.find((d) => d.code === code);
    if (discount && total >= discount.minOrder) {
      setAppliedCode(discount);
      setInputCode("");
    } else {
      alert("Mã giảm giá không hợp lệ hoặc đơn hàng không đạt mức yêu cầu!");
    }
  };

  const discountAmount = appliedCode?.discount || 0;
  const finalTotal = total - discountAmount;

  return (
    <div className="space-y-4">
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Đơn Hàng</h3>
        <div className="space-y-3 border-b pb-4">
          <div className="flex justify-between text-gray-700">
            <span>Tạm tính:</span>
            <span className="font-medium">{total.toLocaleString("vi-VN")} ₫</span>
          </div>
          {appliedCode && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá ({appliedCode.code}):</span>
              <span className="font-medium">-{discountAmount.toLocaleString("vi-VN")} ₫</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
          <span className="text-2xl font-bold text-red-600">
            {finalTotal.toLocaleString("vi-VN")} ₫
          </span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Đặt Hàng Ngay (Áp dụng cho Việt Nam)
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
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleApplyCode(inputCode)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
          >
            Áp dụng
          </button>
        </div>

        {/* Available Discounts */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">Mã đang có sẵn:</p>
          {getApplicableDiscounts().length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Hãy mua thêm để mở khóa mã giảm giá</p>
            </div>
          ) : (
            getApplicableDiscounts().map((discount) => (
              <div
                key={discount.id}
                onClick={() => handleApplyCode(discount.code)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                  appliedCode?.id === discount.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-yellow-50 hover:border-yellow-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{discount.code}</p>
                    <p className="text-xs text-gray-600">{discount.description}</p>
                  </div>
                  <span className="text-base font-bold text-red-600">
                    -{discount.discount.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
