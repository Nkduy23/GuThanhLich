import type { Cart_Item } from "../../../types";
import { useState, useEffect } from "react";

interface CartRowProps {
  item: Cart_Item & {
    availableColors: { color: string; variantId: string }[];
    availableSizes: string[];
  };
  onRemove: (_id: string) => void;
  onQuantityChange: (_id: string, quantity: number) => void;
  onVariantChange: (_id: string, variantId: string, size: string, quantity?: number) => void;
}

const CartRow: React.FC<CartRowProps> = ({ item, onRemove, onQuantityChange, onVariantChange }) => {
  const [selectedColor, setSelectedColor] = useState(item.color);
  const [selectedSize, setSelectedSize] = useState(item.size);
  const [availableSizesForColor, setAvailableSizesForColor] = useState(item.availableSizes);

  useEffect(() => {
    const colorVariant = item.availableColors.find((c) => c.color === selectedColor);
    if (colorVariant && colorVariant.variantId !== item.variantId) {
      setAvailableSizesForColor(item.availableSizes);
    }
  }, [selectedColor, item]);

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    const newVariantId = item.availableColors.find((c) => c.color === newColor)?.variantId;
    if (newVariantId && newColor !== item.color) {
      onVariantChange(item._id, newVariantId, selectedSize);
    }
  };

  const handleSizeChange = (newSize: string) => {
    setSelectedSize(newSize);
    if (newSize !== item.size) {
      onVariantChange(item._id, item.variantId, newSize, item.quantity);
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="py-4 px-4">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      </td>

      <td className="py-4 px-4 font-medium text-gray-800">{item.name}</td>

      <td className="py-4 px-4">
        <select
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {item.availableColors.map((c) => (
            <option key={c.variantId} value={c.color}>
              {c.color}
            </option>
          ))}
        </select>
      </td>

      <td className="py-4 px-4">
        <select
          value={selectedSize}
          onChange={(e) => handleSizeChange(e.target.value)}
          className="border rounded px-2 py-1"
          disabled={availableSizesForColor.length === 0}
        >
          <option value="">Chọn size</option>
          {availableSizesForColor.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>

      <td className="py-4 px-4 text-center">
        <select
          value={item.quantity}
          onChange={(e) => onQuantityChange(item._id, parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </td>

      <td className="py-4 px-4 text-gray-800 text-right">
        {item.unit_price.toLocaleString("vi-VN")} ₫
      </td>

      <td className="py-4 px-4 text-blue-600 font-semibold text-right">
        {item.total_price.toLocaleString("vi-VN")} ₫
      </td>

      <td className="py-4 px-4 text-center">
        <button
          onClick={() => onRemove(item._id)}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default CartRow;
