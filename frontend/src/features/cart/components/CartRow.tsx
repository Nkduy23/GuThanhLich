import { useState, useEffect } from "react";
import { useCart } from "@/context/cart/useCart";
import type { CartRowProps } from "./types";

const CartRow: React.FC<CartRowProps & { isMobile?: boolean }> = ({
  item,
  onRemove,
  onQuantityChange,
  onVariantChange,
  isMobile = false,
}) => {
  const { updatingIds } = useCart();
  const isUpdating = updatingIds.has(item._id);

  const [selectedColor, setSelectedColor] = useState(item.color);
  const [selectedSize, setSelectedSize] = useState(item.size);
  const [availableSizesForColor, setAvailableSizesForColor] = useState(item.availableSizes);

  useEffect(() => {
    setSelectedColor(item.color);
    setSelectedSize(item.size);
    setAvailableSizesForColor(item.availableSizes);
  }, [item.color, item.size, item.availableSizes]);

  const handleColorChange = (newColor: string) => {
    if (isUpdating || newColor === item.color) return;
    setSelectedColor(newColor);
    const newVariant = item.availableColors.find((c) => c.color === newColor);
    if (newVariant) {
      onVariantChange(item._id, newVariant.variantId, selectedSize);
    }
  };

  const handleSizeChange = (newSize: string) => {
    if (isUpdating || newSize === item.size || !newSize) return;
    setSelectedSize(newSize);
    onVariantChange(item._id, item.variantId, newSize, item.quantity);
  };

  const handleQuantityDec = () => {
    if (isUpdating || item.quantity <= 1) return;
    onQuantityChange(item._id, item.quantity - 1);
  };

  const handleQuantityInc = () => {
    if (isUpdating || item.quantity >= 100) return;
    onQuantityChange(item._id, item.quantity + 1);
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return;
    const val = parseInt(e.target.value) || 1;
    const clamped = Math.min(Math.max(val, 1), 100);
    if (clamped !== item.quantity) {
      onQuantityChange(item._id, clamped);
    }
  };

  const formatPrice = (price: number | undefined) => (price || 0).toLocaleString("vi-VN");

  // =============== MOBILE LAYOUT (dưới lg) ===============
  if (isMobile) {
    return (
      <div className="flex flex-wrap gap-4 py-6 border-b border-gray-200 last:border-0">
        {/* Hình ảnh */}
        <div className="flex-shrink-0">
          <img
            src={item.image || "/placeholder.jpg"}
            alt={item.name}
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg shadow-sm"
          />
        </div>

        {/* Thông tin sản phẩm + controls */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Tên sản phẩm */}
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>

            {/* Màu & Size */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Màu sắc</p>
                <select
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.availableColors.map((c) => (
                    <option key={c.variantId} value={c.color}>
                      {c.color}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-gray-600 mb-1">Kích cỡ</p>
                <select
                  value={selectedSize}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  disabled={isUpdating || !availableSizesForColor?.length}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                >
                  <option value="">Chọn size</option>
                  {availableSizesForColor?.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Số lượng + giá + xóa */}
          <div className="mt-4 flex items-end justify-between">
            <div className="flex flex-col gap-2">
              {/* Số lượng */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuantityDec}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center transition"
                >
                  −
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={handleQuantityInput}
                  disabled={isUpdating}
                  className="w-16 text-center border border-gray-300 rounded-lg py-2 disabled:opacity-50"
                />
                <button
                  onClick={handleQuantityInc}
                  disabled={isUpdating || item.quantity >= 100}
                  className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center transition"
                >
                  +
                </button>
              </div>

              {/* Giá */}
              <div className="text-right sm:text-left">
                <p className="text-sm text-gray-600">Đơn giá: {formatPrice(item.unit_price)} ₫</p>
                <p className="text-lg font-bold text-blue-600">{formatPrice(item.total_price)} ₫</p>
              </div>
            </div>

            {/* Nút xóa */}
            <button
              onClick={() => onRemove(item._id)}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =============== DESKTOP LAYOUT (lg trở lên) ===============
  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="py-6 px-2 align-top">
        <img
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg shadow-sm"
        />
      </td>

      <td className="py-6 px-2 align-top max-w-[200px]">
        <p className="font-medium text-gray-900 line-clamp-3">{item.name}</p>
      </td>

      <td className="py-6 px-2 align-top">
        <select
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          disabled={isUpdating}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 min-w-[80px]"
        >
          {item.availableColors.map((c) => (
            <option key={c.variantId} value={c.color}>
              {c.color}
            </option>
          ))}
        </select>
      </td>

      <td className="py-6 px-2 align-top">
        <select
          value={selectedSize}
          onChange={(e) => handleSizeChange(e.target.value)}
          disabled={isUpdating || !availableSizesForColor?.length}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 min-w-[80px]"
        >
          <option value="">Chọn size</option>
          {availableSizesForColor?.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>

      <td className="py-6 px-2 align-top text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleQuantityDec}
            disabled={isUpdating || item.quantity <= 1}
            className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center transition text-lg"
          >
            −
          </button>
          <input
            type="text"
            value={item.quantity}
            onChange={handleQuantityInput}
            disabled={isUpdating}
            className="w-15 text-center border border-gray-300 rounded-lg py-2 disabled:opacity-50"
          />
          <button
            onClick={handleQuantityInc}
            disabled={isUpdating || item.quantity >= 100}
            className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center transition text-lg"
          >
            +
          </button>
        </div>
      </td>

      <td className="min-w-10 py-6 align-top text-right font-medium text-gray-800">
        {formatPrice(item.unit_price)}
      </td>

      <td className="py-6 px-2  align-top text-right font-bold text-blue-600">
        {formatPrice(item.total_price)}
      </td>

      <td className="py-6 px-2 align-top text-center">
        <button
          onClick={() => onRemove(item._id)}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default CartRow;
