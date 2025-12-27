import { useState, useEffect } from "react";
import { useCart } from "@/context/cart/useCart";
import type { CartRowProps } from "./types";

const CartRow: React.FC<CartRowProps> = ({ item, onRemove, onQuantityChange, onVariantChange }) => {
  const { updatingIds } = useCart(); // Lấy updatingIds từ context
  const isUpdating = updatingIds.has(item._id); //Check item này đang update không

  const [selectedColor, setSelectedColor] = useState(item.color);
  const [selectedSize, setSelectedSize] = useState(item.size);
  const [availableSizesForColor, setAvailableSizesForColor] = useState(item.availableSizes);

  useEffect(() => {
    setSelectedColor(item.color);
    setSelectedSize(item.size);
    setAvailableSizesForColor(item.availableSizes);
  }, [item.color, item.size, item.availableSizes]); // Sync khi item thay đổi (từ optimistic/server)

  // Fix useEffect: Filter availableSizes dựa trên selectedColor (nếu bạn có data sizes per variant)
  // Giả sử availableSizes là global cho product; nếu per variant, pass từ context hoặc fetch quick
  useEffect(() => {
    // Ví dụ: Nếu có map sizes per color, filter ở đây. Hiện giữ nguyên để mượt
    // const colorVariant = item.availableColors.find((c) => c.color === selectedColor);
    // if (colorVariant) setAvailableSizesForColor(/* sizes from variant */ || item.availableSizes);
    setAvailableSizesForColor(item.availableSizes); // Giữ tạm, optimistic
  }, [selectedColor, item.availableSizes]);

  const handleColorChange = (newColor: string) => {
    if (isUpdating) return;
    setSelectedColor(newColor);
    const newVariantId = item.availableColors.find((c) => c.color === newColor)?.variantId;
    if (newVariantId && newColor !== item.color) {
      onVariantChange(item._id, newVariantId, selectedSize);
    }
  };

  const handleSizeChange = (newSize: string) => {
    if (isUpdating || !newSize) return;
    setSelectedSize(newSize);
    if (newSize !== item.size) {
      onVariantChange(item._id, item.variantId, newSize, item.quantity);
    }
  };

  const handleQuantityDec = () => {
    if (isUpdating || item.quantity <= 1) return; // Disable nếu updating hoặc min=1
    onQuantityChange(item._id, item.quantity - 1);
  };

  const handleQuantityInc = () => {
    if (isUpdating || item.quantity >= 100) return; // Disable nếu updating hoặc max=100
    onQuantityChange(item._id, item.quantity + 1);
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return; // Disable input nếu updating
    const val = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 100);
    onQuantityChange(item._id, val);
  };

  // Guard: Safe formatting cho prices
  const formatPrice = (price: number | undefined) => (price || 0).toLocaleString("vi-VN");

  return (
    <tr className="border-b mb-4 border-gray-200 hover:bg-gray-50 transition">
      <td className="py-2 px-2">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      </td>

      <td className="w-[150px] break-words py-2 px-2 font-medium text-gray-800 ">{item.name}</td>

      <td className="py-2 px-2">
        <select
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          disabled={isUpdating} // Disable select nếu updating
          className="border border-gray-200 rounded px-2 py-1 disabled:opacity-50"
        >
          {item.availableColors.map((c) => (
            <option key={c.variantId} value={c.color}>
              {c.color}
            </option>
          ))}
        </select>
      </td>

      <td className="py-2 px-2">
        <select
          value={selectedSize}
          onChange={(e) => handleSizeChange(e.target.value)}
          disabled={isUpdating || !availableSizesForColor?.length} // Kết hợp với old logic
          className="border border-gray-200 rounded px-2 py-1 w-[50px] disabled:opacity-50"
        >
          <option value="">Chọn size</option>
          {availableSizesForColor?.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>

      <td className="py-2 px-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          {/* Nút - */}
          <button
            onClick={handleQuantityDec}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>

          {/* Input */}
          <input
            type="number"
            value={item.quantity}
            min="1"
            max="100"
            onChange={handleQuantityInput}
            disabled={isUpdating}
            className="w-16 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Nút + */}
          <button
            onClick={handleQuantityInc}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </td>

      <td className="py-2 px-2 text-gray-800 text-right">{formatPrice(item.unit_price)} ₫</td>

      <td className="py-2 px-2 text-blue-600 font-semibold text-right">
        {formatPrice(item.total_price)} ₫
      </td>

      <td className="py-2 px-2 text-center">
        <button
          onClick={() => onRemove(item._id)}
          disabled={isUpdating} // Disable xóa nếu đang update quantity/variant
          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default CartRow;
